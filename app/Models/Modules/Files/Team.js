'use strict'

const Model = use('Model')
const Cache = use('Cache')

class Team extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')

    this.addHook('beforeUpdate', async (modelInstance) => modelInstance._clearCache())

    this.addHook('beforeDelete', async (modelInstance) => {
      // delete all files inside the team
      let objects = await modelInstance.objects().fetch()
      for (let object of objects.rows) {
        await object.delete()
      }
    })
  }

  static get incrementing () {
    return false
  }

  static get table () {
    return 'modules_files_teams'
  }

  users () {
    return this.belongsToMany('App/Models/User').withPivot(['manage']).pivotTable('modules_files_teams_users')
  }

  roles () {
    return this.belongsToMany('App/Models/Role').withPivot(['manage']).pivotTable('modules_files_teams_roles')
  }

  objects () {
    return this.hasMany('App/Models/Modules/Files/Object')
  }

  async userCanRead (user) {
    return Cache.tags(['modules-files-team']).remember(`modules-files-team/${this.id}/user-can-read/${user.id}`, 5, async () => {
      // check if the user has explicit permission
      let users = await this.users().fetch()
      let userPermission = users.toJSON().find(m => m.id === user.id)

      if (userPermission) return !!userPermission

      // check if the user has permission through a role
      let roles = await this.roles().fetch()
      for (let role of roles.toJSON()) {
        let userHasRole = await user.hasRole(role.id)
        if (userHasRole) return true
      }

      return false
    })
  }

  async userCanWrite (user) {
    return Cache.tags(['modules-files-team']).remember(`modules-files-team/${this.id}/user-can-write/${user.id}`, 5, async () => {
      // check if the user has explicit permission
      let users = await this.users().fetch()
      let userPermission = users.toJSON().find(m => m.id === user.id)

      if (userPermission) return userPermission.pivot.manage

      // check if the user has permission through a role
      let roles = await this.roles().fetch()
      for (let role of roles.toJSON()) {
        let userHasRole = await user.hasRole(role.id)
        if (userHasRole && role.pivot.manage) return true
      }

      return false
    })
  }

  async _clearCache () {
    await Cache.tags(['modules-files-team']).flush()
  }
}

module.exports = Team
