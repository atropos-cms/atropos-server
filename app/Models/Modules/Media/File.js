'use strict'

const Config = use('Config')
const Drive = use('Drive')
const Model = use('Model')
const Cache = use('Cache')

class File extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')

    this.addHook('beforeDelete', async (modelInstance) => {
      await modelInstance.deleteStorageFiles()
    })
  }

  static get incrementing () {
    return false
  }

  static get table () {
    return 'modules_media_files'
  }

  static get availableTypes () {
    return {
      r: ['300', '600', '1200', '2400'],
      s: ['50', '300', '600']
    }
  }

  owner () {
    return this.belongsTo('App/Models/User', 'owner_id')
  }

  getStoragePath () {
    return Drive._fullPath(`media/${this.storage_file}`)
  }

  async getDownloadUrlIfAvailable (type = null, size = null) {
    if (!await this.getFileExists(type, size)) return null

    return this.getDownloadUrl(type, size)
  }

  getDownloadUrl (type = null, size = null) {
    let appUrl = Config.get('atropos.api.public.url')

    if (type && size) {
      return `${appUrl}/modules/media/files/${type}/${size}/${this.id}/download`
    }

    return `${appUrl}/modules/media/files/${this.id}/download`
  }

  async getFileExists (type = null, size = null) {
    const cacheKey = `modules-media-file/${type}/${size}/${this.id}`

    return Cache.tags(['modules-media-file']).remember(cacheKey, 15, async () => {
      if (type && size) {
        return Drive.exists(`media/${type}/${size}/${this.storage_file}`)
      }

      return Drive.exists(`media/${this.storage_file}`)
    })
  }

  async deleteStorageFiles () {
    // if this is a file, delete the file in the drive
    if (await this.getFileExists()) {
      await Drive.delete(`media/${this.storage_file}`)
    }

    // delete all generated thumbnails
    let types = Object.keys(File.availableTypes)
    for (let type of types) {
      for (let size of File.availableTypes[type]) {
        if (await this.getFileExists(type, size)) {
          await Drive.delete(`media/${type}/${size}/${this.storage_file}`)
        }
      }
    }
  }
}

module.exports = File
