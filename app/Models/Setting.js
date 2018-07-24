'use strict'

const Model = use('Model')
const Cache = use('Cache')

class Setting extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')

    this.addHook('beforeUpdate', async (modelInstance) => modelInstance._clearCache())
  }

  static get incrementing () {
    return false
  }

  contactUser () {
    return this.belongsTo('App/Models/User', 'user_contact_id')
  }

  async _clearCache () {
    await Cache.tags(['settings']).flush()
  }
}

module.exports = Setting
