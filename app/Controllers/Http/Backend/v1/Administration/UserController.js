'use strict'

const kue = use('Kue')
const Hash = use('Hash')
const Event = use('Event')
const Persona = use('Persona')
const User = use('App/Models/User')
const UserTransformer = use('App/Transformers/Backend/v1/Administration/UserTransformer')
const PasswordChangedJob = use('App/Jobs/Auth/PasswordChanged')

class UserController {
  async index ({ transform }) {
    let users = await User.query()
      .orderBy('first_name', 'asc')
      .fetch()

    return transform.collection(users, UserTransformer)
  }

  async show ({ params, transform }) {
    let user = await User.query()
      .where('id', params.id)
      .first()

    return transform.item(user, UserTransformer)
  }

  async store ({ auth, request, transform }) {
    let user = await User.create({
      ...request.only([
        'activated',
        'email',
        'first_name',
        'last_name',
        'street',
        'postal_code',
        'city',
        'country'
      ]),
      // create a random, double hashed password for a new user.
      password: await Hash.make(require('randomstring').generate(32)),
      account_status: 'pending',
      last_action: null,
      last_login: null
    })

    await user.roles().attach(request.only(['roles']).roles)

    if (request.input('notify_account_created')) {
      const token = await Persona.generateToken(user, 'password')
      Event.fire('user::created', { user, admin: auth.user, token })
    }

    return transform.item(user, UserTransformer)
  }

  async update ({ params, request, transform }) {
    let user = await User.query()
      .where('id', params.id)
      .first()

    if (request.all().hasOwnProperty('password')) {
      await this._updatePassword(user, request)
    } else {
      await this._updateAccount(user, request)
    }

    return transform.item(user, UserTransformer)
  }

  async destroy ({ params }) {
    return User
      .query()
      .where({ id: params.id })
      .delete()
  }

  async _updateAccount (user, request) {
    const data = request.only([
      'first_name',
      'last_name',
      'email',
      'activated',
      'street',
      'postal_code',
      'city',
      'country'
    ])

    if (data.email && data.email !== user.email) {
      user.account_status = 'pending'
    }

    user.merge(data)

    // sync roles
    let roles = request.only(['roles']).roles.map(r => r.id || r)
    await user.roles().sync(roles)

    return user.save()
  }

  async _updatePassword (user, request) {
    const data = request.only(['password', 'password_confirmation'])

    user.password = data['password']

    if (!request.input('dont_send_notification')) {
      kue.dispatch(PasswordChangedJob.key, { user }, 'high')
    }

    return user.save()
  }
}

module.exports = UserController
