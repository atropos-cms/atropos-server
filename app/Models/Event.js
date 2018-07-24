'use strict'

const Model = use('Model')

class Event extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')

    this.addHook('beforeCreate', async (eventInstance) => {
      eventInstance.scope = eventInstance.scope || 'public'
    })
  }

  static get incrementing () {
    return false
  }

  setContent (content) {
    return JSON.stringify(content)
  }

  getContent (content) {
    return JSON.parse(content)
  }

  restrictedUsers () {
    return this.belongsToMany('App/Models/User').pivotTable('events_restricted_users')
  }

  restrictedRoles () {
    return this.belongsToMany('App/Models/Role').pivotTable('events_restricted_roles')
  }
}

module.exports = Event
