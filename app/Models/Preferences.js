'use strict'

const Model = use('Model')

class Permission extends Model {
  static boot () {
    super.boot()
  }

  static get incrementing () {
    return false
  }

  static get createdAtColumn () {
    return null
  }
  static get updatedAtColumn () {
    return null
  }

  static get table () {
    return 'user_preferences'
  }

  static get primaryKey () {
    return 'user_id'
  }

  static get hidden () {
    return ['user_id']
  }

  user () {
    return this.hasOne('App/Models/User', 'user_id', 'id')
  }
}

module.exports = Permission
