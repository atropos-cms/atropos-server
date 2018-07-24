'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('permissions', table => {
      table.uuid('id').primary()
      table.string('name').notNullable()
    })

    this.create('permissions_roles', (table) => {
      table.uuid('permission_id')
      table.uuid('role_id')
      table.primary(['permission_id', 'role_id'])
    })
  }

  down () {
    this.drop('permissions')
    this.drop('permissions_roles')
  }
}

module.exports = UserSchema
