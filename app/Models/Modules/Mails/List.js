'use strict'

const Model = use('Model')
const Cache = use('Cache')

/*
* The property send_permission describes who can send to this list.
* supported: ['everyone', 'members']
*/
class List extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')
  }

  static get incrementing () {
    return false
  }

  static get table () {
    return 'modules_mails_lists'
  }

  users () {
    return this.belongsToMany('App/Models/User').pivotTable('modules_mails_lists_users')
  }

  roles () {
    return this.belongsToMany('App/Models/Role').pivotTable('modules_mails_lists_roles')
  }

  async members () {
    const cacheKey = `modules-mails-list/${this.id}/members`

    return Cache.tags(['modules-mails-list']).remember(cacheKey, 15, async () => {
      let users = (await this.users().fetch()).toJSON()
      let roles = (await this.roles().with('members').fetch()).toJSON()

      for (let role of roles) {
        let newUsers = role.members.filter(m => !users.find(u => u.id === m.id))
        users = users.concat(newUsers)
      }

      return users
    })
  }
}

module.exports = List
