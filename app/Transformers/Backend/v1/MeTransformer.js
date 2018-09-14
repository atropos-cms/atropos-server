'use strict'

const moment = require('moment')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class MeTransformer extends TransformerAbstract {
  defaultInclude () {
    return [
      'roles',
      'permissions',
      'preferences'
    ]
  }

  async transform (model, { request }) {
    return {
      id: model.id,

      first_name: model.first_name,
      last_name: model.last_name,
      email: model.email,
      account_status: model.account_status,

      street: model.street,
      postal_code: model.postal_code,
      city: model.city,
      country: model.country,

      created_at: moment(model.created_at).toISOString(),
      updated_at: moment(model.updated_at).toISOString(),
      last_login: moment(model.last_login).toISOString(),
      last_action: moment(model.last_action).toISOString(),

      full_name: model.getFullName()
    }
  }

  async includeRoles (model) {
    let roles = await model.getRelated('roles').toJSON()
    return roles.map(role => role.id)
  }

  async includePermissions (model) {
    let roles = await model.getRelated('roles').rows
    let permissions = []

    for (let role of roles) {
      let rolePermissions = (await role.permissions().fetch()).rows
      permissions = permissions.concat(rolePermissions.map(p => p.name))
    }

    return [...new Set(permissions)]
  }

  async includePreferences (model) {
    let preferences = await model.getRelated('preferences').toJSON()
    return preferences
  }
}

module.exports = MeTransformer
