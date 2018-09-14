'use strict'

const Mail = use('Mail')
const Config = use('Config')
const Job = use('App/Jobs/Job')

class NotifyAccountCreated extends Job {
  static get key () {
    return 'auth--account-created'
  }

  async handle ({ user, admin, resetUrl }) {
    try {
      await this.init({ user })

      this.info(`Sending notification for new account to "${user.email}"...`)

      await Mail.send('emails.auth.account-created', { user, admin, resetUrl }, (message) => {
        message.from(Config.get('atropos.mailSenderAddress'))
        message.to(user.email)
        message.subject(this.antl.formatMessage('emails.subject--account-created', { abbreviation: this.branding.abbreviation, admin: admin.full_name }))
      })

      this.completed('Auth/NotifyAccountCreated', `Account creation mail delivered to "${user.email}"`)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = NotifyAccountCreated
