'use strict'

const Mail = use('Mail')
const Config = use('Config')
const Job = use('App/Jobs/Job')
const MailModel = use('App/Models/Modules/Mails/Mail')

class SendMailToUser extends Job {
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 5
  }

  static get key () {
    return 'modules-mails-send--send-mail-to-user'
  }

  async handle ({user, mailId, sender}) {
    await this.init({user})

    let mailModel = await MailModel.findOrFail(mailId)
    let attachments = await mailModel.attachments().fetch()

    this.info(`Sending mail to "${user.email}"...`)

    let replyAddress = sender.email || Config.get('atropos.mailSenderAddress')

    await Mail.send('emails.modules.mails.send', {user, sender, subject: mailModel.subject, content: mailModel.content}, (message) => {
      message.from(Config.get('atropos.mailSenderAddress'), sender.full_name)
      message.replyTo(replyAddress, sender.full_name)
      message.to(user.email, user.full_name)
      message.subject(mailModel.subject)

      // add attachments
      for (let attachment of attachments.rows) {
        message.attach(attachment.getStoragePath(), {
          filename: attachment.original_filename
        })
      }
    })

    this.completed('Modules/Mails/SendMailToUser', `Email delivered to "${user.email}"`)
  }
}

module.exports = SendMailToUser
