'use strict'

const Role = use('App/Models/Role')
const Permission = use('App/Models/Permission')
const RoleTransformer = use('App/Transformers/Backend/v1/Administration/RoleTransformer')

class RoleController {
  async index ({transform}) {
    let roles = await Role.query()
      .with('members')
      .fetch()

    return transform.include('members,permissions').collection(roles, RoleTransformer)
  }

  async show ({params, transform}) {
    let role = await Role.query()
      .where('id', params.id)
      .with('members').first()

    return transform.include('members,permissions').item(role, RoleTransformer)
  }

  async store ({request, transform}) {
    let role = await Role.create({
      ...request.only([
        'name'
      ])
    })

    await role.load('members')

    return transform.include('members,permissions').item(role, RoleTransformer)
  }

  async update ({params, request, transform}) {
    let role = await Role.query()
      .where('id', params.id)
      .first()

    await role.merge(request.only(['name']))

    // Clear cache for all members that were in this role
    let membersModels = await role.members().fetch()
    for (let member of membersModels.rows) {
      member._clearCache()
    }

    // assign new members
    let members = request.only(['members']).members.map(m => m.id || m)
    await role.members().sync(members)

    // assign new permissions
    let permissions = await Permission.query().whereIn('name', request.only(['permissions']).permissions).fetch()
    await role.permissions().detach()
    await role.permissions().saveMany(permissions.rows)

    // this will clear the cache again, since permissions changed and new users could have been added.
    await role.save()

    await role.load('members')
    return transform.include('members,permissions').item(role, RoleTransformer)
  }

  async destroy ({params}) {
    return Role.query()
      .where({id: params.id})
      .delete()
  }
}

module.exports = RoleController
