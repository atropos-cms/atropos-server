'use strict'

const Event = use('Event')
const Persona = use('Persona')
const User = use('App/Models/User')

class PasswordResetController {
  async send ({request, response}) {
    const email = request.input('uid')

    try {
      let user = await User.query()
        .where('email', email)
        .first()

      const token = await Persona.generateToken(user, 'password')

      Event.fire('forgot::password', { user, token })
    } catch (e) {
      Event.fire('forgot::failed', {email})
    }
  }

  async reset ({request, response}) {
    const token = request.input('token')
    const payload = request.only(['password', 'password_confirmation'])

    let user = await Persona.updatePasswordByToken(token, payload)

    // The user just used their email address to reset the password
    // so we can set the email as confirmed
    user.account_status = 'active'
    user.save()

    Event.fire('event::auth::new-password', {
      owner_id: user.id,
      scope: 'private'
    })
  }
}

module.exports = PasswordResetController
