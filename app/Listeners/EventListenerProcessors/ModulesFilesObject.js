class ModulesFilesObject {
  async processData (type, data) {
    let team = (await data.team().fetch())

    let roles = (await team.roles().fetch()).rows.map(r => r.id)
    let users = (await team.users().fetch()).rows.map(r => r.id)

    return {
      scope: 'restricted',
      entity_id: data.id,
      restricted_roles: roles,
      restricted_users: users,
      content: {
        name: data.name,

        parent_id: data.parent_id,
        team_id: data.team_id,
        owner_id: data.owner_id,

        mime_type: data.mime_type,
        kind: data.kind,
        size: data.size
      }
    }
  }

  setNew () {

  }

  updateExisting () {

  }
}

module.exports = ModulesFilesObject
