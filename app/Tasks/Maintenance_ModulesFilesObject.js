'use strict'

const Task = use('Task')
const moment = require('moment')
const Drive = use('Drive')
const Helpers = use('Helpers')
const DownloadToken = use('App/Models/Modules/Files/DownloadToken')

class MaintenanceModulesFilesObject extends Task {
  static get schedule () {
    return '0 */10 * * * *'
  }

  async handle () {
    this.info('Starting maintenance task: MaintenanceModulesFilesObject')

    let downloadTokens = await DownloadToken.query()
      .where('used_at', '<', DownloadToken.formatDates(null, moment().subtract(1, 'minutes')))
      .orWhere('created_at', '<', DownloadToken.formatDates(null, moment().subtract(1, 'hour')))
      .with('object')
      .fetch()

    for (let downloadToken of downloadTokens.rows) {
      this.debug(`Removing expired download-token: ${downloadToken.id}`)

      let file = await downloadToken.getRelated('object')

      Drive.delete(`${Helpers.tmpPath()}/${file.id}.zip`)

      await downloadToken.delete()
    }

    this.info('Finished: MaintenanceModulesFilesObject')
  }
}

module.exports = MaintenanceModulesFilesObject
