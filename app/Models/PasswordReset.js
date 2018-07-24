'use strict'

const Model = use('Model')

class PasswordReset extends Model {
  static get updatedAtColumn () {
    return null
  }
}

module.exports = PasswordReset
