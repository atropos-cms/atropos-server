'use strict'

const Event = use('Event')
const Persona = use('Persona')
const acceptLanguage = require('accept-language')

class AuthController {
  async login ({ auth, request, response }) {
    try {
      const payload = request.only(['uid', 'password'])
      const user = await Persona.verify(payload, this._checkActivated)

      const token = await auth
        .withRefreshToken()
        .generate(user)

      await this._setLastLogin(user)

      return response.send({ token })
    } catch (e) {
      // create a promise based timeout
      const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

      // wait for one second if we are not in testing mode
      // this will prevent a userspamming too many requests
      if (process.env.NODE_ENV !== 'testing') {
        await timeout(1200)
      }

      // responde with an error
      return response.unauthorized({ error: { message: e.message } })
    }
  }

  async refresh ({ auth, request, response }) {
    try {
      const refreshToken = request.input('refreshToken')

      const token = await auth.generateForRefreshToken(refreshToken)

      return response.send({ token })
    } catch (e) {
      // responde with an error
      return response.unauthorized({ error: { message: e.message } })
    }
  }

  async logout ({ response }) {
    return response.ok()
  }

  async get ({ auth, request, transform }) {
    this._setLocalPreference(auth.user, request)
    this._setLastAction(auth.user)

    return transform.item(auth.user, 'App/Transformers/Backend/v1/MeTransformer')
  }

  async update ({ auth, request, transform }) {
    if (request.all().hasOwnProperty('old_password')) {
      await this._updatePassword(auth, request)
    } else {
      await this._updateAccount(auth, request)
    }

    return transform.item(auth.user, 'App/Transformers/Backend/v1/MeTransformer')
  }

  async sendEmailVerification ({ auth, request, transform }) {
    const user = auth.user
    const token = await Persona.generateToken(user, 'email')
    Event.fire('email::send-verification', { user, token })
  }

  async verifyEmail ({ auth, request, transform, params }) {
    const token = request.input('token')
    await Persona.verifyEmail(token)
  }

  _checkActivated (user) {
    if (!user.activated) throw new Error('E_ACCOUNT_NOT_ACTIVATED: Your account has not been activated yet.')
  }

  async _setLastAction (user) {
    user.merge({ last_action: new Date() })
    await user.save()
  }

  async _setLastLogin (user) {
    user.merge({ last_login: new Date() })
    await user.save()
  }

  async _updateAccount (auth, request) {
    const user = auth.user
    const payload = request.only([
      'first_name',
      'last_name',
      'email',
      'activated',
      'street',
      'postal_code',
      'city',
      'country'
    ])

    return Persona.updateProfile(user, payload)
  }

  async _updatePassword (auth, request) {
    const payload = request.only(['old_password', 'password', 'password_confirmation'])
    const user = auth.user

    await Persona.updatePassword(user, payload)

    Event.fire('event::auth::new-password', {
      owner_id: auth.user.id,
      scope: 'private'
    })

    return user
  }

  async _setLocalPreference (user, request) {
    let langHeader = request.headers()['accept-language']

    if (!langHeader) return
    let preferences = await user.preferences().fetch()

    if (preferences.locale) return

    acceptLanguage.languages(['en', 'de'])

    preferences.locale = acceptLanguage.get(langHeader)
    preferences.save()
  }
}

module.exports = AuthController
