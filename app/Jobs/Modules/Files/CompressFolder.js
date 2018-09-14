'use strict'

const fs = require('fs')
const Drive = use('Drive')
const Helpers = use('Helpers')
const Raven = require('raven')
const archiver = require('archiver')
const File = use('App/Models/Modules/Files/Object')
const DownloadToken = use('App/Models/Modules/Files/DownloadToken')
const Job = use('App/Jobs/Job')

class CompressFolder extends Job {
  static get key () {
    return 'modules-files-compress-folder'
  }

  async handle (token) {
    await this.init()

    let downloadToken = await DownloadToken.findOrFail(token.id)

    this.info(`Compressing Folder: "${downloadToken.object_id}"...`)

    try {
      await this._createZip(downloadToken)
    } catch (error) {
      downloadToken.merge({ status: 'FAILED' })
      downloadToken.save()

      this.error('Modules/Files/CompressFolder', `Error while creating zip. Downloadtoken invalidated: ${downloadToken.id}`)

      Raven.captureException(error)
    }
  }

  async _createZip (downloadToken) {
    downloadToken.merge({ status: 'COMPRESSING' })
    downloadToken.save()

    let folderEntity = await File.query()
      .where('id', downloadToken.object_id)
      .where('team_id', downloadToken.team_id)
      .first()

    let archive = this._setup(folderEntity.id)

    await this._addFilesToZip(archive, folderEntity)

    await archive.finalize()

    downloadToken.merge({ status: 'OK' })
    downloadToken.save()

    this.completed('Modules/Files/CompressFolder', `Created zip for folder '${folderEntity.id}'`)
  }

  _setup (folderId) {
    // create a file to stream archive data to.
    let output = fs.createWriteStream(`${Helpers.tmpPath()}/${folderId}.zip`)
    let archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      throw err
    })

    // pipe archive data to the file
    archive.pipe(output)

    return archive
  }

  async _addFilesToZip (archive, folderEntity, folderPrefix = '') {
    for (let fileEntity of (await folderEntity.children().fetch()).rows) {
      if (fileEntity.kind === 'file') {
        this.info(`Adding File: "${folderPrefix}${fileEntity.name}"`)
        fileEntity.trackDownload()

        await archive.append(Drive.getStream(`files/${fileEntity.storage_file}`), { name: `${folderPrefix}${fileEntity.name}${fileEntity.file_extension}` })
      } else if (fileEntity.kind === 'folder') {
        this.info(`Adding Folder: "${folderPrefix}${fileEntity.name}"`)
        await this._addFilesToZip(archive, fileEntity, `${folderPrefix}${fileEntity.name}/`)
      }
    }
  }
}

module.exports = CompressFolder
