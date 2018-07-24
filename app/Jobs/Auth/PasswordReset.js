'use strict'

const Mail = use('Mail')
const Config = use('Config')
const Job = use('App/Jobs/Job')

class PasswordReset extends Job {
  static get key () {
    return 'auth--password-reset'
  }

  async handle ({user, resetUrl}) {
    await this.init({user})

    this.info(`Sending password reset link to "${user.email}"...`)

    await Mail.send('emails.auth.password-reset', {user, resetUrl}, (message) => {
      message.from(Config.get('atropos.mailSenderAddress'))
      message.to(user.email)
      message.subject(this.antl.formatMessage('emails.subject--password-reset', { abbreviation: this.branding.abbreviation }))
    })

    this.completed('Auth/PasswordReset', `Password reset link delivered to "${user.email}"`)
  }
}

module.exports = PasswordReset
