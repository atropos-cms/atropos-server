class ModulesMailsMail {
  async processData (type, data) {
    return {
      scope: 'restricted',
      entity_id: data.mail.id,
      restricted_roles: null,
      restricted_users: Array.from(data.recipientList.keys()),
      content: {
        subject: data.mail.subject,
        content: data.mail.content,
        sender_id: data.mail.sender_id
      }
    }
  }

  setNew () {
  }

  updateExisting () {
  }
}

module.exports = ModulesMailsMail
