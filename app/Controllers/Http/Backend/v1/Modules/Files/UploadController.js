'use strict'

const kue = use('Kue')
const Drive = use('Drive')
const Event = use('Event')
const File = use('App/Models/Modules/Files/Object')
const PreviewJob = use('App/Jobs/Modules/Files/Preview')
const ObjectTransformer = use('App/Transformers/Backend/v1/Modules/Files/ObjectTransformer')
const uuidV4 = require('uuid/v4')
const hasha = require('hasha')

class UploadController {
  async upload ({request, params, auth, transform}) {
    let fileEntity = await File.findByOrFail('upload_token', params.token)

    fileEntity.status = 'uploading'
    fileEntity.save()

    try {
      request.multipart.file('file', {}, async (file) => {
        let name = file.clientName.lastIndexOf('.') > 0 ? file.clientName.substr(0, file.clientName.lastIndexOf('.')) : file.clientName
        let fileExtension = file.clientName.lastIndexOf('.') > 0 ? file.clientName.substr(file.clientName.lastIndexOf('.')) : ''

        const fileName = `${uuidV4()}${fileExtension}`

        let hash = hasha.fromStream(file.stream, { algorithm: 'sha256' })

        await Promise.all([
          Drive.put(`${fileEntity.drivePath}/${fileName}`, file.stream),
          hash
        ])

        // Update File entity
        fileEntity.storage_file = fileName
        fileEntity.original_filename = name
        fileEntity.mime_type = file.headers['content-type']
        fileEntity.file_extension = fileExtension
        fileEntity.sha256_checksum = await hash
        fileEntity.size = file.stream.byteCount
        fileEntity.upload_token = null
        fileEntity.status = 'ready'

        await fileEntity.save()
      })

      await request.multipart.process()
    } catch (error) {
      await fileEntity.delete()
      throw Error('E_FILE_UPLOAD_FAILED: There was an error while processing the file.')
    }

    // reload the file entity, since the user could have
    // changed some properties while it was uploading
    await fileEntity.reload()

    Event.fire('event::modules-files-object::new', {
      owner_id: auth.user.id,
      data: fileEntity
    })

    // dispatch an event to generate a thumbnail
    kue.dispatch(PreviewJob.key, fileEntity.id, {priority: 'low'})

    return transform.item(fileEntity, ObjectTransformer)
  }
}

module.exports = UploadController
