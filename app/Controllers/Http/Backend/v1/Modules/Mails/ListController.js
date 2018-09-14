'use strict'

const moment = require('moment')
const List = use('App/Models/Modules/Mails/List')
const ListTransformer = use('App/Transformers/Backend/v1/Modules/Mails/ListTransformer')

class ListController {
  async index ({ transform }) {
    let lists = await List.query()
      .with('users')
      .with('roles')
      .fetch()

    return transform.collection(lists, ListTransformer)
  }

  async show ({ params, transform }) {
    let list = await List.query()
      .where({ id: params.id })
      .with('users')
      .with('roles')
      .firstOrFail()

    return transform.item(list, ListTransformer)
  }

  async store ({ request, tenant, transform }) {
    let data = {
      ...request.only([
        'name'
      ]),
      tenant_id: tenant
    }

    let list = await List.create(data)

    return transform.item(list, ListTransformer)
  }

  async update ({ params, request, transform }) {
    let list = await List.query()
      .where('id', params.id)
      .firstOrFail()

    await list.merge(request.only('name'))
    list.updated_at = moment()
    await list.save()

    let users = request.only(['users']).users
    await list.users().detach()
    await list.users().attach(users.map(m => m.id))

    let roles = request.only(['roles']).roles
    await list.roles().detach()
    await list.roles().attach(roles.map(m => m.id))

    return transform.item(list, ListTransformer)
  }

  async destroy ({ params }) {
    return List.query()
      .where({ id: params.id })
      .delete()
  }
}

module.exports = ListController
