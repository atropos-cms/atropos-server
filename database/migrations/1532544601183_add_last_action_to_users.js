'use strict'

const Schema = use('Schema')

class AddLastActionToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.dateTime('last_action').nullable()
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('last_action')
    })
  }
}

module.exports = AddLastActionToUsersSchema
