'use strict'

const moment = require('moment')
const Statistic = use('App/Models/Statistic')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class TeamTransformer extends TransformerAbstract {
  static get defaultInclude () {
    return [
      'canRead',
      'canWrite',
      'users',
      'roles',
      'storageUsed'
    ]
  }

  async transform (model) {
    return {
      id: model.id,
      name: model.name,

      created_at: moment(model.created_at).toISOString(),
      updated_at: moment(model.updated_at).toISOString()
    }
  }

  async includeCanRead (model, { auth }) {
    return model.userCanRead(auth.user)
  }

  async includeCanWrite (model, { auth }) {
    return model.userCanWrite(auth.user)
  }

  async includeUsers (model) {
    let users = await model.getRelated('users').toJSON()

    return this.collection(users, model => {
      return {
        id: model.id,
        manage: !!model.pivot.manage
      }
    })
  }

  async includeRoles (model) {
    let roles = await model.getRelated('roles').toJSON()

    return this.collection(roles, model => {
      return {
        id: model.id,
        manage: !!model.pivot.manage
      }
    })
  }

  async includeStorageUsed (model) {
    return Statistic.latestAmount({
      id: model.id,
      source: 'modules-files-teams',
      type: 'storage'
    })
  }
}

module.exports = TeamTransformer
