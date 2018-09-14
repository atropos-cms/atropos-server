'use strict'

const Mail = use('Mail')
const Config = use('Config')
const Job = use('App/Jobs/Job')

class PasswordResetFailed extends Job {
  static get key () {
    return 'auth--password-reset-failed'
  }

  async handle ({ email }) {
    await this.init()

    this.info(`Sending PasswordResetFailed email to "${email}"...`)

    await Mail.send('emails.auth.password-reset-failed', { email }, (message) => {
      message.from(Config.get('atropos.mailSenderAddress'))
      message.to(email)
      message.subject(this.antl.formatMessage('emails.subject--password-reset-failed', { abbreviation: this.branding.abbreviation }))
    })

    this.completed('Auth/PasswordResetFailed', `PasswordResetFailed email to "${email}"`)
  }
}

module.exports = PasswordResetFailed
