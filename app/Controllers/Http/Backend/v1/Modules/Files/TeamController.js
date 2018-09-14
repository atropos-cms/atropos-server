'use strict'

const moment = require('moment')
const Cache = use('Cache')
const Team = use('App/Models/Modules/Files/Team')
const TeamTransformer = use('App/Transformers/Backend/v1/Modules/Files/TeamTransformer')

class TeamController {
  async index ({ transform }) {
    let teams = await Team.query()
      .with('users')
      .with('roles')
      .fetch()

    return transform.collection(teams, TeamTransformer)
  }

  async show ({ params, transform }) {
    let team = await Team.query()
      .where({ id: params.id })
      .with('users')
      .with('roles')
      .first()

    return transform.item(team, TeamTransformer)
  }

  async store ({ request, transform }) {
    let data = {
      ...request.only([
        'name'
      ])
    }

    let team = Team.create(data)
    return transform.item(team, TeamTransformer)
  }

  async update ({ params, request, transform }) {
    let team = await Team.query()
      .where({ id: params.id })
      .first()

    await team.merge(request.only(['name']))
    team.updated_at = moment()
    await team.save()

    let users = request.only(['users']).users
    await team.users().detach()
    await team.users().attach(users.map(m => m.id), row => {
      row.manage = users.find(m => m.id === row.user_id).manage
    })

    let roles = request.only(['roles']).roles
    await team.roles().detach()
    await team.roles().attach(roles.map(m => m.id), row => {
      row.manage = roles.find(m => m.id === row.role_id).manage
    })

    Cache.tags(['modules-files-team']).flush()

    return transform.item(team, TeamTransformer)
  }

  async destroy ({ params }) {
    let team = await Team.query()
      .where({ id: params.id })
      .first()

    return team.delete()
  }
}

module.exports = TeamController
