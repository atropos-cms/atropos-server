'use strict'

const Schema = use('Schema')

class PasswordResetSchema extends Schema {
  up () {
    this.create('password_resets', table => {
      table.string('email', 191).primary()
      table.string('token', 191).notNullable().unique()
      table.dateTime('created_at').nullable()
    })
  }

  down () {
    this.drop('password_resets')
  }
}

module.exports = PasswordResetSchema
