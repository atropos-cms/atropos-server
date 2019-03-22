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
    return `
      media:regenerate
      { --media : Only regenerate Media files }
      { --files : Only regenerate previews for files }`
  }

  static get description () {
    return 'This command regenerates all media files thumbnails and exif data'
  }

  async handle (args, flags) {
    if (!flags.media && !flags.files) {
      this.info(`No media regenerated. Set the --media or --files flags.`)
      process.exit(0)
    }

    if (flags.media) {
      await this.regenerateMedia()
    }

    if (flags.files) {
      await this.regenerateFiles()
    }

    this.success('All media files processed')

    await Redis.quit(Config.get('kue.connection'))
    await Database.close()
    process.exit(0)
  }

  async regenerateMedia () {
    this.info(`Processing media....`)

    let files = (await File.query().orderBy('created_at', 'desc').fetch()).toJSON()
    for (let file of files) {
      this.info(`Processing '${file.id}'....`)
      await kue.dispatch(MediaThumbnailsJob.key, file, 'low').result
      await kue.dispatch(MediaExifJob.key, file, 'low').result
    }
  }

  async regenerateFiles () {
    this.info(`Processing files....`)

    let objects = (await Object.query().fetch()).toJSON()
    for (let file of objects) {
      this.info(`Processing '${file.id}'....`)
      await kue.dispatch(FilesPreviewJob.key, file.id, 'low').result
    }
  }
}

module.exports = MediaRegenerate
