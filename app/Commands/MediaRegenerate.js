'use strict'

const kue = use('Kue')
const Redis = use('Redis')
const Config = use('Config')
const Database = use('Database')
const { Command } = require('@adonisjs/ace')
const File = use('App/Models/Modules/Media/File')
const Object = use('App/Models/Modules/Files/Object')
const MediaThumbnailsJob = use('App/Jobs/Modules/Media/Thumbnails')
const MediaExifJob = use('App/Jobs/Modules/Media/Exif')
const FilesPreviewJob = use('App/Jobs/Modules/Files/Preview')

class MediaRegenerate extends Command {
  static get signature () {
    return 'media:regenerate'
  }

  static get description () {
    return 'This command regenerates all media files thumbnails and exif data'
  }

  async handle (args, options) {
    this.info(`Processing media....`)

    let files = (await File.query().where({ browsable: true }).fetch()).toJSON()
    for (let file of files) {
      this.info(`Processing '${file.id}'....`)
      await kue.dispatch(MediaThumbnailsJob.key, file, 'low').result
      await kue.dispatch(MediaExifJob.key, file, 'low').result
    }

    this.info(`Processing files....`)

    let objects = (await Object.query().fetch()).toJSON()
    for (let file of objects) {
      this.info(`Processing '${file.id}'....`)
      await kue.dispatch(FilesPreviewJob.key, file.id, 'low').result
    }

    this.success('All media files processed')

    await Redis.quit(Config.get('kue.connection'))
    await Database.close()
    process.exit(0)
  }
}

module.exports = MediaRegenerate
