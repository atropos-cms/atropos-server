'use strict'

const Mail = use('Mail')
const Config = use('Config')
const Job = use('App/Jobs/Job')

class VerifyEmail extends Job {
  static get key () {
    return 'auth--verify-email'
  }

  async handle ({user, verificationUrl}) {
    await this.init({user})

    this.info(`Sending email address verification mail to "${user.email}"...`)

    await Mail.send('emails.auth.verify-email', {user, verificationUrl}, (message) => {
      message.from(Config.get('atropos.mailSenderAddress'))
      message.to(user.email)
      message.subject(this.antl.formatMessage('emails.subject--verify-email', {abbreviation: this.branding.abbreviation, email: user.email}))
    })

    this.completed('Auth/VerifyEmail', `Email address verification mail delivered to "${user.email}"`)
  }
}

module.exports = VerifyEmail
