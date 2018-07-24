'use strict'

const Mail = use('Mail')
const Job = use('App/Jobs/Job')

class SendMailToContact extends Job {
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 5
  }

  static get key () {
    return 'modules-mails-send--send-mail-to-contact'
  }

  async handle ({name, email, subject, content, contact}) {
    await this.init({user: contact})

    if (!contact) {
      return this.error(`There is no contact email address defined to send the message to`)
    }

    this.info(`Sending mail to "${contact.email}"...`)

    await Mail.send('emails.modules.mails.contact', {user: contact, sender: name, email, subject, content, messageBorderColor: '#eb9e05'}, (message) => {
      message.from(email, name)
      message.to(contact.email, contact.full_name)
      message.subject(this.antl.formatMessage('emails.subject--modules-mails-contact', {abbreviation: this.branding.abbreviation, subject}))
    })

    this.completed('Modules/Mails/SendMailToContact', `Email delivered to "${contact.email}"`)
  }
}

module.exports = SendMailToContact
