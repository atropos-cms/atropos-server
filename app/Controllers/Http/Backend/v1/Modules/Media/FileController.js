'use strict'

const File = use('App/Models/Modules/Media/File')
const FileTransformer = use('App/Transformers/Backend/v1/Modules/Media/FileTransformer')
const uuidV4 = require('uuid/v4')

class FileController {
  async index ({request, params, transform}) {
    let page = request.get().page || 1

    let files = await File.query()
      .where({browsable: true})
      .orderBy('name', 'desc')
      .paginate(page, 50)

    return transform.paginate(files, FileTransformer)
  }

  async show ({params, transform}) {
    let file = await File.query()
      .where({browsable: true})
      .where({id: params.id})
      .firstOrFail()

    return transform.item(file, FileTransformer)
  }

  async store ({request, params, auth, transform}) {
    let data = {
      browsable: false,
      ...request.all(),
      owner_id: auth.user.id,
      upload_token: uuidV4(),
      trashed: false,
      status: 'preparing'
    }

    let file = await File.create(data)

    return transform.item(file, FileTransformer)
  }

  async update ({params, request, transform}) {
    let file = await File.query()
      .where({id: params.id})
      .firstOrFail()

    await file.merge(request.all())
    await file.save()

    return transform.item(file, FileTransformer)
  }

  async destroy ({params, request}) {
    let file = await File.query()
      .where({id: params.id})
      .firstOrFail()

    return file.delete()
  }
}

module.exports = FileController
