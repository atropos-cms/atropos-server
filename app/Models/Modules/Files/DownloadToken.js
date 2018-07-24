'use strict'

const moment = require('moment')
const Model = use('Model')
const Config = use('Config')

class DownloadToken extends Model {
  static boot () {
    super.boot()
    this.addTrait('App/Models/Traits/Uuid')
  }

  static get incrementing () {
    return false
  }

  static get table () {
    return 'modules_files_download_tokens'
  }

  getDownloadUrl () {
    if (this.status !== 'OK') return null

    let appUrl = Config.get('atropos.api.backend.url')

    return `${appUrl}/modules/files/download/${this.id}`
  }

  async getDownloadFilename () {
    let object = await this.object().fetch()

    if (object.kind === 'file') {
      return `${object.name}${object.file_extension}`
    }

    if (object.kind === 'folder') {
      return `${object.name}.zip`
    }

    return `${moment().unix()}.zip`
  }

  object () {
    return this.belongsTo('App/Models/Modules/Files/Object', 'object_id')
  }

  owner () {
    return this.belongsTo('App/Models/User', 'owner_id')
  }

  team () {
    return this.belongsTo('App/Models/Modules/Files/Team', 'team_id')
  }
}

module.exports = DownloadToken
