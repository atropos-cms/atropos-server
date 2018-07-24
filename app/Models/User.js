'use strict'

const Model = use('Model')
const Preferences = use('App/Models/Preferences')
const Cache = use('Cache')

class User extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')

    this.addHook('beforeSave', 'UserHook.hashPassword')
    this.addHook('afterCreate', async (modelInstance) => {
      await modelInstance.preferences().save(new Preferences())
    })
  }

  static get incrementing () {
    return false
  }

  static get dates () {
    return super.dates.concat(['last_login'])
  }

  static get hidden () {
    return ['password']
  }

  static get computed () {
    return ['full_name']
  }

  getFullName () {
    let fullName = this.first_name
    if (this.last_name !== null) fullName += ` ${this.last_name}`
    return fullName
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  roles () {
    return this.belongsToMany('App/Models/Role').pivotTable('roles_users')
  }

  preferences () {
    return this.hasOne('App/Models/Preferences')
  }

  async getMemberOfRoles () {
    return Cache.tags(['users']).remember(`user-member-of-roles/${this.id}`, 15, async () => {
      let roles = await this.roles().fetch()
      return roles.toJSON().map(r => r.id)
    })
  }

  async hasRole (role) {
    if (!role) return false

    let roleId = (role instanceof Object) ? role.id : role

    let userHasRoles = await this.getMemberOfRoles()

    return userHasRoles.includes(roleId)
  }

  async getPermissions () {
    return Cache.tags(['users']).remember(`user-permissions/${this.id}`, 15, async () => {
      let roles = (await this.roles().fetch()).rows
      let permissions = []

      for (let role of roles) {
        let rolePermissions = (await role.permissions().fetch()).rows
        permissions = permissions.concat(rolePermissions.map(p => p.name))
      }

      return [...new Set(permissions)]
    })
  }

  async hasPermission (permission) {
    if (!permission) return false

    let permissionId = (permission instanceof Object) ? permission.name : permission

    return (await this.getPermissions()).includes(permissionId)
  }

  async _clearCache () {
    await Cache.tags(['users']).forget(`user-member-of-roles/${this.id}`)
    await Cache.tags(['users']).forget(`user-permissions/${this.id}`)
    await Cache.tags(['modules-files-team']).flush()
  }
}

module.exports = User
