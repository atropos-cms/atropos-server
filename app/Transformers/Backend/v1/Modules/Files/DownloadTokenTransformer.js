'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class DownloadTokenTransformer extends TransformerAbstract {
  async transform (model, {auth}) {
    return {
      id: model.id,
      team_id: model.team_id,
      object_id: model.object_id,
      owner_id: model.owner_id,

      type: model.type,
      status: model.status,

      file_name: await model.getDownloadFilename(),
      url: model.getDownloadUrl()
    }
  }
}

module.exports = DownloadTokenTransformer
