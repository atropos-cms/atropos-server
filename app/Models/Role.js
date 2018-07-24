'use strict'

const Model = use('Model')

class Role extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')

    this.addHook('beforeUpdate', async (modelInstance) => {
      let members = await modelInstance.members().fetch()
      for (let member of members.rows) {
        member._clearCache()
      }
    })
  }

  static get incrementing () {
    return false
  }

  members () {
    return this.belongsToMany('App/Models/User').pivotTable('roles_users')
  }

  permissions () {
    return this.belongsToMany('App/Models/Permission').pivotTable('permissions_roles')
  }
}

module.exports = Role
