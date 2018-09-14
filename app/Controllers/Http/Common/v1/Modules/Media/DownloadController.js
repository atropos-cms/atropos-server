'use strict'

const Drive = use('Drive')
const File = use('App/Models/Modules/Media/File')

class DownloadController {
  async download ({ request, response, params }) {
    let { id, type, size } = params
    let fileEntity

    try {
      fileEntity = await File.findOrFail(id)
    } catch (e) {
      return this.throwNotFoundError({ id })
    }

    let filePath = this.getFilePath(fileEntity.storage_file, type, size)

    if (!await Drive.exists(`media/${filePath}`)) {
      return this.throwNotFoundError({ id, type, size })
    }

    return response.download(
      Drive.getStream(`media/${filePath}`).path,
      `${fileEntity.name}${fileEntity.file_extension}`
    )
  }

  getFilePath (filePath, type = null, size = null) {
    if (!type && !size) return filePath

    if (File.availableTypes[type] && File.availableTypes[type].includes(size)) {
      return `${type}/${size}/${filePath}`
    }

    return this.throwNotFoundError({ type, size })
  }

  throwNotFoundError ({ id, type, size }) {
    if (type && size) {
      throw Error(`E_FILE_NOT_FOUND: The media file with this type '${type}' and size '${size}' could not be found.`)
    }

    if (id) {
      throw Error(`E_FILE_NOT_FOUND: The media file with this id '${id}' could not be found.`)
    }

    throw Error(`E_FILE_NOT_FOUND: The requested media file could not be found.`)
  }
}

module.exports = DownloadController
