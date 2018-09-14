'use strict'

const Object = use('App/Models/Modules/Files/Object')
const ObjectTransformer = use('App/Transformers/Backend/v1/Modules/Files/ObjectTransformer')
const uuidV4 = require('uuid/v4')

class ObjectController {
  async index ({ request, params, transform }) {
    let parent = request.input('parent', null) === 'null' ? null : request.input('parent', null)
    let objects = await Object.query()
      .where('team_id', params.team)
      .where('parent_id', parent)
      .with('stargazers')
      .fetch()

    return transform.collection(objects, ObjectTransformer)
  }

  async show ({ params, transform }) {
    let object = await Object.query()
      .where({ id: params.id })
      .where('team_id', params.team)
      .first()

    return transform.item(object, ObjectTransformer)
  }

  async store ({ request, params, auth, transform }) {
    let parent = request.input('parent', null) === 'null' ? null : request.input('parent', null)
    let status = request.input('kind') === 'file' ? 'preparing' : 'ready'

    let data = {
      ...request.only([
        'owner_id',
        'name',
        'kind',
        'description',
        'file_extension',
        'mime_type',
        'modified_at',
        'status'
      ]),
      parent_id: parent,
      team_id: params.team,
      owner_id: auth.user.id,
      upload_token: uuidV4(),
      trashed: false,
      status: status
    }

    let object = await Object.create(data)

    return transform.item(object, ObjectTransformer)
  }

  async update ({ params, request, transform }) {
    let object = await Object.findOrFail(params.id)

    await object.merge(request.only([
      'parent_id',
      'owner_id',
      'name',
      'description',
      'file_extension',
      'mime_type',
      'status'
    ]))
    await object.save()

    return transform.item(object, ObjectTransformer)
  }

  async destroy ({ params, request }) {
    let object = await Object.query()
      .where({ id: params.id })
      .where('team_id', params.team)
      .first()

    return object.delete()
  }

  async star ({ params, request, transform, auth }) {
    let object = await Object.findOrFail(params.id)

    await object.stargazers().attach([auth.user.id])

    return transform.item(object, ObjectTransformer)
  }

  async unstar ({ params, request, transform, auth }) {
    let object = await Object.findOrFail(params.id)

    await object.stargazers().detach([auth.user.id])

    return transform.item(object, ObjectTransformer)
  }
}

module.exports = ObjectController
