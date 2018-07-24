'use strict'

const Schema = use('Schema')

class ModulesMailListSchema extends Schema {
  up () {
    this.create('modules_mails_lists', (table) => {
      table.uuid('id').primary()
      table.string('name').nullable()
      table.string('send_permission').default('members')
      table.timestamps()
    })
    this.create('modules_mails_lists_users', (table) => {
      table.increments()
      table.uuid('list_id')
      table.uuid('user_id')
    })
    this.create('modules_mails_lists_roles', (table) => {
      table.increments()
      table.uuid('list_id')
      table.uuid('role_id')
    })
  }

  down () {
    this.drop('modules_mails_lists')
    this.drop('modules_mails_lists_users')
    this.drop('modules_mails_lists_roles')
  }
}

module.exports = ModulesMailListSchema
