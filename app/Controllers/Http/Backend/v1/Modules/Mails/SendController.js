'use strict'

const Event = use('Event')
const User = use('App/Models/User')
const List = use('App/Models/Modules/Mails/List')
const Mail = use('App/Models/Modules/Mails/Mail')
const kue = use('Kue')
const SendMailToUserJob = use('App/Jobs/Modules/Mails/SendMailToUser')

class SendController {
  async send ({auth, request, transform}) {
    let {to, subject, content} = request.post()

    // create mail entity
    const mail = await Mail.create({
      content: content,
      subject: subject,
      sender_id: auth.user.id
    })

    let attachments = request.only(['attachments']).attachments.map(a => a.id || a)
    await mail.attachments().detach()
    await mail.attachments().attach(attachments)

    let recipientList = new Map()

    for (let recipient of to) {
      let match = recipient.match(/(list|user):(.*)/)
      let type = match[1]
      let id = match[2]

      if (type === 'list') {
        let list = await List.findByOrFail('id', id)
        let users = await list.members()
        for (let user of users) {
          recipientList.set(user.id, user)
        }

        await mail.lists().attach([list.id])
      }

      if (type === 'user') {
        let user = await User.findByOrFail('id', id)
        recipientList.set(user.id, user)

        await mail.users().attach([user.id])
      }
    }

    for (let user of recipientList.values()) {
      this.sendMailToUser(user, mail.id, auth.user)
    }

    Event.fire('event::modules-mails-mail::new', {
      owner_id: auth.user.id,
      data: {mail: mail, recipientList: recipientList}
    })

    return true
  }

  async sendMailToUser (user, mailId, sender) {
    kue.instance
      .create(SendMailToUserJob.key, {user, mailId, sender})
      .priority('low')
      .attempts(3)
      .backoff({delay: 10 * 1000, type: 'fixed'})
      .removeOnComplete(true)
      .save()
  }
}

module.exports = SendController
