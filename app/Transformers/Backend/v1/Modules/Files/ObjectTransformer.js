'use strict'

const Drive = use('Drive')
const moment = require('moment')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class ObjectTransformer extends TransformerAbstract {
  availableInclude () {
    return [
      'preview'
    ]
  }

  async transform (model, {auth}) {
    let users = await model.stargazers().fetch()
    let stared = users.rows.map(u => u.id).includes(auth.user.id)

    return {
      id: model.id,
      team_id: model.team_id,
      parent_id: model.parent_id,

      owner_id: model.owner_id,

      kind: model.kind,

      name: model.name,
      description: model.description,
      file_extension: model.file_extension,
      mime_type: model.mime_type,

      sha256_checksum: model.sha256_checksum,
      original_filename: model.original_filename,
      size: model.size,

      trashed: model.trashed,
      status: model.status,

      uploaded_at: moment(model.created_at).toISOString(),
      updated_at: moment(model.updated_at).toISOString(),
      modified_at: moment(model.modified_at).toISOString(),

      stared: stared,

      upload_token: model.upload_token,

      has_preview: await model.getPreviewExists()
    }
  }

  async includePreview (model) {
    if (!await model.getPreviewExists()) return null

    const file = await Drive.get(model.previewPath())

    return `data:image/jpg;base64,${file.toString('base64')}`
  }
}

module.exports = ObjectTransformer
