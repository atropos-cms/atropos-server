'use strict'

const moment = require('moment')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class FileTransformer extends TransformerAbstract {
  async transform (model, { request }) {
    return {
      id: model.id,
      owner_id: model.owner_id,

      name: model.name,
      description: model.description,
      file_extension: model.file_extension,
      mime_type: model.mime_type,

      sha256_checksum: model.sha256_checksum,
      original_filename: model.original_filename,
      size: model.size,

      browsable: model.browsable,
      trashed: model.trashed,
      status: model.status,

      exif: model.exif ? JSON.parse(model.exif) : null,

      created_at: moment(model.created_at).toISOString(),
      updated_at: moment(model.updated_at).toISOString(),

      upload_token: model.upload_token,

      download_url: model.getDownloadUrl(),

      r: {
        300: model.getDownloadUrl('r', 300),
        600: await model.getDownloadUrlIfAvailable('r', 600),
        1200: await model.getDownloadUrlIfAvailable('r', 1200),
        2400: await model.getDownloadUrlIfAvailable('r', 2400)
      },

      s: {
        50: await model.getDownloadUrlIfAvailable('s', 50),
        300: model.getDownloadUrl('s', 300),
        600: await model.getDownloadUrlIfAvailable('s', 600)
      }
    }
  }
}

module.exports = FileTransformer
