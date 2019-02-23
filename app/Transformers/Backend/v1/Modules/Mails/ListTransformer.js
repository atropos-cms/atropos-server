'use strict'

const moment = require('moment')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class ListTransformer extends TransformerAbstract {
  static get defaultInclude () {
    return [
      'users',
      'roles'
    ]
  }

  async transform (model) {
    return {
      id: model.id,
      name: model.name,

      members_count: (await model.members()).length,

      created_at: moment(model.created_at).toISOString(),
      updated_at: moment(model.updated_at).toISOString()
    }
  }

  async includeUsers (model) {
    let users = await model.getRelated('users').toJSON()

    return this.collection(users, model => {
      return {
        id: model.id
      }
    })
  }

  async includeRoles (model) {
    let roles = await model.getRelated('roles').toJSON()

    return this.collection(roles, model => {
      return {
        id: model.id
      }
    })
  }
}

module.exports = ListTransformer
