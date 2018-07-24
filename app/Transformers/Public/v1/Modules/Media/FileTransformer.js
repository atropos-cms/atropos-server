'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class FileTransformer extends TransformerAbstract {
  async transform (model, {request}) {
    return {
      id: model.id,

      name: model.name,
      description: model.description,
      file_extension: model.file_extension,
      mime_type: model.mime_type,

      sha256_checksum: model.sha256_checksum,
      original_filename: model.original_filename,
      size: model.size,

      created_at: model.created_at,
      updated_at: model.updated_at,

      download_url: model.getDownloadUrl(),

      r: {
        300: await model.getDownloadUrlIfAvailable('r', 300),
        600: await model.getDownloadUrlIfAvailable('r', 600),
        1200: await model.getDownloadUrlIfAvailable('r', 1200),
        2400: await model.getDownloadUrlIfAvailable('r', 2400)
      },
      s: {
        50: await model.getDownloadUrlIfAvailable('s', 50),
        300: await model.getDownloadUrlIfAvailable('s', 300),
        600: await model.getDownloadUrlIfAvailable('s', 600)
      }
    }
  }
}

module.exports = FileTransformer
