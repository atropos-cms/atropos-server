'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.uuid('id').primary()
      table.string('first_name').notNullable()
      table.string('last_name').nullable()
      table.string('email', 191).notNullable().unique()
      table.string('password', 160).notNullable()
      table.boolean('activated').default(false)
      table.string('street').nullable()
      table.string('postal_code').nullable()
      table.string('city').nullable()
      table.string('country').nullable()
      table.string('account_status').nullable()
      table.dateTime('last_login').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
