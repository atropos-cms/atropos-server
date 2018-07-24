'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('user_preferences', table => {
      table.uuid('user_id').primary()
      table.string('locale').nullable()
    })
  }

  down () {
    this.drop('user_preferences')
  }
}

module.exports = UserSchema
