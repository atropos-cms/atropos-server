'use strict'

const Model = use('Model')

class Permission extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')
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

  roles () {
    return this.belongsToMany('App/Models/Role').pivotTable('permissions_roles')
  }
}

module.exports = Permission
