'use strict'

const Mail = use('Mail')
const Config = use('Config')
const Job = use('App/Jobs/Job')

class PasswordChanged extends Job {
  static get key () {
    return 'auth--password-changed'
  }

  async handle ({user}) {
    await this.init({user})

    this.info(`Sending password changed mail to "${user.email}"...`)

    await Mail.send('emails.auth.password-changed', {user}, (message) => {
      message.from(Config.get('atropos.mailSenderAddress'))
      message.to(user.email)
      message.subject(this.antl.formatMessage('emails.subject--password-changed', { abbreviation: this.branding.abbreviation }))
    })

    this.completed('Auth/PasswordChanged', `Password changed mail delivered to "${user.email}"`)
  }
}

module.exports = PasswordChanged
