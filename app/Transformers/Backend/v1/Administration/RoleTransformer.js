'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class RoleTransformer extends TransformerAbstract {
  availableInclude () {
    return [
      'members',
      'permissions'
    ]
  }

  async transform (model, { request }) {
    return {
      id: model.id,

      name: model.name
    }
  }

  async includeMembers (model) {
    let members = await model.members().fetch()
    return members.rows.map(member => member.id)
  }

  async includePermissions (model) {
    let permissions = await model.permissions().fetch()
    return permissions.rows.map(permission => permission.name)
  }
}

module.exports = RoleTransformer
