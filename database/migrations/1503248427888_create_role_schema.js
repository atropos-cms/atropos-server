'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('roles', table => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.timestamps()
    })

    this.create('roles_users', (table) => {
      table.uuid('user_id')
      table.uuid('role_id')
      table.primary(['user_id', 'role_id'])
    })
  }

  down () {
    this.drop('roles')
    this.drop('roles_users')
  }
}

module.exports = UserSchema
