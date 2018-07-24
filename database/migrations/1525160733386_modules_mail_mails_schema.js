'use strict'

const Schema = use('Schema')

class ModulesMailMailsSchema extends Schema {
  up () {
    this.create('modules_mail_mails', (table) => {
      table.uuid('id').primary()
      table.string('subject')
      table.text('content', 'longtext')
      table.uuid('sender_id')
      table.timestamps()
    })

    this.create('modules_mail_mails_recipient_users', (table) => {
      table.increments()
      table.uuid('mail_id')
      table.uuid('user_id')
    })

    this.create('modules_mail_mails_recipient_lists', (table) => {
      table.increments()
      table.uuid('mail_id')
      table.uuid('list_id')
    })

    this.create('modules_mail_mails_attachments', (table) => {
      table.increments()
      table.uuid('mail_id')
      table.uuid('file_id')
    })
  }

  down () {
    this.drop('modules_mail_mails')
    this.drop('modules_mail_mails_recipient_users')
    this.drop('modules_mail_mails_recipient_lists')
    this.drop('modules_mail_mails_attachments')
  }
}

module.exports = ModulesMailMailsSchema
