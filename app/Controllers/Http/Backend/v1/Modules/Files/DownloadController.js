'use strict'

const Drive = use('Drive')
const kue = use('Kue')
const Helpers = use('Helpers')
const File = use('App/Models/Modules/Files/Object')
const CompressFolderJob = use('App/Jobs/Modules/Files/CompressFolder')
const DownloadToken = use('App/Models/Modules/Files/DownloadToken')
const DownloadTokenTransformer = use('App/Transformers/Backend/v1/Modules/Files/DownloadTokenTransformer')

class DownloadController {
  async request ({ request, response, params, transform, auth }) {
    let object = await File.query()
      .where({ id: params.id })
      .where('team_id', params.team)
      .first()

    let status = 'WAITING'
    let usesLeft = request.input('type') === 'preview' ? 3 : 1

    let downloadToken = await DownloadToken.create({
      object_id: params.id,
      team_id: params.team,
      owner_id: auth.user.id,
      uses_left: usesLeft,
      status: status
    })

    if (object.kind === 'file') {
      await this._prepareFile(downloadToken)
    }

    if (object.kind === 'folder') {
      await this._compressFolder(downloadToken)
    }

    return transform.item(downloadToken, DownloadTokenTransformer)
  }

  async status ({ request, response, params, transform }) {
    let downloadToken = await DownloadToken.findOrFail(params.token)
    return transform.item(downloadToken, DownloadTokenTransformer)
  }

  async download ({ req, res, auth, request, response, params }) {
    let downloadToken = await DownloadToken.query().with('object').where('id', params.token).first()

    // check if the token has any uses left
    if (!downloadToken || downloadToken.uses_left === 0) throw Error('E_DOWNLOAD_TOKEN_INVALID: This download-token is not valid.')

    let file = await downloadToken.getRelated('object')
    let driveStream = this._getDriveStream(file)

    // if the file does not exist in the file system, return an error
    if (!await Drive.exists(driveStream.path)) {
      throw Error('E_FILE_NOT_FOUND: The requested file could not be found.')
    }

    // when the socket closes, check how much data was sent
    // if we sent more than 90% of the file we will count this as a download
    res.on('finish', async () => {
      if (req.connection.bytesWritten < file.size * 0.9) return

      // update the uses left on the token
      downloadToken.merge({
        used_at: new Date(),
        uses_left: --downloadToken.uses_left
      })
      await downloadToken.save()

      // track the download
      await file.trackDownload()
    })

    // return the file as an attachment
    return response.attachment(
      Drive.getStream(driveStream.path).path,
      driveStream.name
    )
  }

  async _prepareFile (downloadToken) {
    downloadToken.merge({ status: 'OK' })
    downloadToken.save()
  }

  async _compressFolder (downloadToken) {
    kue.dispatch(CompressFolderJob.key, downloadToken)
  }

  _getDriveStream (file) {
    if (file.kind === 'folder') {
      return {
        path: `${Helpers.tmpPath()}/${file.id}.zip`,
        name: `${file.name}.zip`
      }
    }

    return {
      path: `${file.drivePath}/${file.storage_file}`,
      name: `${file.name}${file.file_extension}`
    }
  }
}

module.exports = DownloadController
