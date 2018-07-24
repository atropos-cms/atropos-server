'use strict'

const kue = use('Kue')
const Config = use('Config')
const VerifyEmailJob = use('App/Jobs/Auth/VerifyEmail')
const PasswordResetJob = use('App/Jobs/Auth/PasswordReset')
const PasswordChangedJob = use('App/Jobs/Auth/PasswordChanged')
const PasswordResetFailedJob = use('App/Jobs/Auth/PasswordResetFailed')
const NotifyAccountCreatedJob = use('App/Jobs/Auth/NotifyAccountCreated')

class PersonaListener {
  async sendEmailVerification ({user, oldEmail, token}) {
    let verificationUrl = Config.get('atropos.frontendUrl') + `/auth/verify-email/${token}`

    kue.dispatch(VerifyEmailJob.key, {user, verificationUrl}, 'high')
  }

  async sendPasswordChanged ({user}) {
    kue.dispatch(PasswordChangedJob.key, {user}, 'high')
  }

  async sendPasswordResetEmail ({user, token}) {
    let resetUrl = Config.get('atropos.frontendUrl') + `/auth/reset/${token}`

    kue.dispatch(PasswordResetJob.key, {user, resetUrl}, 'high')
  }

  async sendUserNotFoundEmail ({email}) {
    kue.dispatch(PasswordResetFailedJob.key, {email}, 'high')
  }

  async sendAccountCreatedEmail ({user, admin, token}) {
    let resetUrl = Config.get('atropos.frontendUrl') + `/auth/reset/${token}`

    kue.dispatch(NotifyAccountCreatedJob.key, {user, admin, resetUrl}, 'high')
  }
}

module.exports = PersonaListener
