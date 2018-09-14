'use strict'

const Drive = use('Drive')
const kue = use('Kue')
const ThumbnailsJob = use('App/Jobs/Modules/Media/Thumbnails')
const ExifJob = use('App/Jobs/Modules/Media/Exif')
const File = use('App/Models/Modules/Media/File')
const FileTransformer = use('App/Transformers/Backend/v1/Modules/Media/FileTransformer')
const uuidV4 = require('uuid/v4')
const sharp = require('sharp')
const hasha = require('hasha')

class UploadController {
  async upload ({ request, params, transform }) {
    let fileEntity = await File.findByOrFail('upload_token', params.token)

    let sha256Checksum

    fileEntity.status = 'uploading'
    fileEntity.save()

    let r300Stream = await sharp().rotate().resize(300, 300).max()
    let s300Stream = await sharp().rotate().resize(300, 300)

    try {
      request.multipart.file('file', {}, async (file) => {
        const fileExtension = file.clientName.substr(file.clientName.lastIndexOf('.'))
        const fileName = `${uuidV4()}${fileExtension}`

        let hash = hasha.fromStream(file.stream, { algorithm: 'sha256' })

        if (this.fileIsImage(file.headers['content-type'])) {
          await Promise.all([
            Drive.put(`media/r/300/${fileName}`, file.stream.pipe(r300Stream)),
            Drive.put(`media/s/300/${fileName}`, file.stream.pipe(s300Stream)),
            Drive.put(`media/${fileName}`, file.stream),
            hash
          ])
        } else {
          await Drive.put(`media/${fileName}`, file.stream)
        }

        sha256Checksum = await hash

        // Update File entity
        fileEntity.storage_file = fileName
        fileEntity.original_filename = file.clientName
        fileEntity.mime_type = file.headers['content-type']
        fileEntity.file_extension = fileExtension
        fileEntity.upload_token = null
        fileEntity.sha256_checksum = sha256Checksum
        fileEntity.status = 'ready'

        await fileEntity.save()
      })

      await request.multipart.process()
    } catch (error) {
    }

    // Check if there is already a file with the same hash.
    // If so, return the existing file
    let existingWithSameChecksum = await File.query()
      .where('sha256_checksum', sha256Checksum)
      .whereNot('id', fileEntity.id)
      .first()

    if (existingWithSameChecksum) {
      await fileEntity.delete()
      return transform.item(existingWithSameChecksum, FileTransformer)
    }

    if (this.fileIsImage(fileEntity.mime_type)) {
      kue.dispatch(ThumbnailsJob.key, fileEntity)
      kue.dispatch(ExifJob.key, fileEntity)
    }

    return transform.item(fileEntity, FileTransformer)
  }

  fileIsImage (mimeType) {
    return mimeType.match(/image\/.*/)
  }
}

module.exports = UploadController
