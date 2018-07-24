'use strict'

const Task = use('Task')
const Statistic = use('App/Models/Statistic')
const Team = use('App/Models/Modules/Files/Team')
const File = use('App/Models/Modules/Media/File')

class PerformanceIndicatorsStorage extends Task {
  static get schedule () {
    return '0 0 */6 * * *'
  }

  async handle () {
    this.info('Starting performance-indicators task: PerformanceIndicatorsStorage')

    await this._processApplication()

    this.info('Finished: PerformanceIndicatorsStorage')
  }

  async _processApplication () {
    // total amount of storage consumed
    let totalStorage = 0

    // process file teams teams
    totalStorage += await this._processFilesTeams()

    // process media files
    totalStorage += await this._processMediaFiles()

    this.debug(`Total storage used by application: ${totalStorage}`)

    // create an entry in statistics
    await Statistic.create({
      scope: 'backend',
      source: 'system',
      type: 'storage',
      amount: totalStorage
    })
  }

  async _processFilesTeams () {
    let totalTeams = 0

    let teams = await Team.query().fetch()
    for (let team of teams.rows) {
      totalTeams += await this._processTeam(team)
    }

    // create an entry in statistics
    await Statistic.create({
      scope: 'backend',
      source: 'modules-files-teams',
      type: 'storage',
      amount: totalTeams
    })

    return totalTeams
  }

  async _processTeam (team) {
    this.debug(`Processing team ${team.id}`)

    let amount = 0
    let objects = await team.objects().fetch()

    // total up all objects in a team
    for (let object of objects.rows) {
      amount += object.size
      // account for the generated thumbnails
      amount += Math.min(
        Math.floor(object.size / 300),
        25000
      )
    }

    this.debug(`Total for team ${team.id}: ${amount}`)

    // create an entry in statistics
    await Statistic.create({
      entity_id: team.id,
      scope: 'backend',
      source: 'modules-files-teams',
      type: 'storage',
      amount: amount
    })

    return amount
  }

  async _processMediaFiles () {
    this.debug(`Processing media files`)

    let amount = 0
    let files = await File.query().fetch()

    // total up all media files
    for (let file of files.rows) {
      amount += file.size
      // account for the generated thumbnails
      amount += Math.min(
        Math.floor(file.size / 4)
      )
    }

    this.debug(`Total for all media files: ${amount}`)

    // create an entry in statistics
    await Statistic.create({
      scope: 'backend',
      source: 'modules-media-files',
      type: 'storage',
      amount: amount
    })

    return amount
  }
}

module.exports = PerformanceIndicatorsStorage
