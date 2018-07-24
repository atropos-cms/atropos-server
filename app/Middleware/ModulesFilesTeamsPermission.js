'use strict'

const Team = use('App/Models/Modules/Files/Team')

class ModulesFilesTeamsPermission {
  async handle ({ request, auth }, next, params) {
    const {team: teamId} = request.params
    const permission = params[0]

    if (teamId && (await this.hasPermissionOnTeam(teamId, permission, auth.user))) {
      return next()
    }

    throw new Error(`E_PERMISSION_DENIED: You need ${permission} permission on this team to perform this action.`)
  }

  async hasPermissionOnTeam (teamId, permission, user) {
    let team = await Team.query()
      .where({id: teamId})
      .first()

    if (!team) return false
    if (permission === 'read') return team.userCanRead(user)
    if (permission === 'write') return team.userCanWrite(user)

    return false
  }
}

module.exports = ModulesFilesTeamsPermission
