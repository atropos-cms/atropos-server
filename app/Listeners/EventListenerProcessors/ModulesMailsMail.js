class ModulesMailsMail {
  async processData (type, data) {
    let attachments = (await data.mail.attachments().fetch()).rows.map(r => r.id)

    return {
      scope: 'restricted',
      entity_id: data.mail.id,
      restricted_roles: null,
      restricted_users: Array.from(data.recipientList.keys()),
      content: {
        subject: data.mail.subject,
        content: data.mail.content,
        sender_id: data.mail.sender_id,
        attachments: attachments
      }
    }
  }

  setNew () {
  }

  updateExisting () {
  }
}

module.exports = ModulesMailsMail
