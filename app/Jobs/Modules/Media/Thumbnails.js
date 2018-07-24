'use strict'

const Drive = use('Drive')
const Cache = use('Cache')
const sharp = require('sharp')
const Job = use('App/Jobs/Job')

class Thumbnails extends Job {
  static get key () {
    return 'modules-media-thumbnails'
  }

  async handle (fileEntity) {
    await this.init()

    // load the file from the store
    const file = await Drive.get(`media/${fileEntity.storage_file}`)

    // create thumbnails for all sizes
    let r600 = await sharp(file).rotate().resize(600, 600).max().withoutEnlargement()
    let r1200 = await sharp(file).rotate().resize(1200, 1200).max().withoutEnlargement()
    let r2400 = await sharp(file).rotate().resize(2400, 2400).max().withoutEnlargement()
    let s50 = await sharp(file).rotate().resize(50, 50)
    let s600 = await sharp(file).rotate().resize(600, 600).withoutEnlargement()

    // upload thumbnails in parallel
    await Promise.all([
      Drive.put(`media/r/600/${fileEntity.storage_file}`, r600),
      Drive.put(`media/r/1200/${fileEntity.storage_file}`, r1200),
      Drive.put(`media/r/2400/${fileEntity.storage_file}`, r2400),
      Drive.put(`media/s/50/${fileEntity.storage_file}`, s50),
      Drive.put(`media/s/600/${fileEntity.storage_file}`, s600)
    ])

    // clear the cache for each thumbnail
    await Cache.tags(['modules-media-file']).forget(`modules-media-file/r/600/${fileEntity.id}`)
    await Cache.tags(['modules-media-file']).forget(`modules-media-file/r/1200/${fileEntity.id}`)
    await Cache.tags(['modules-media-file']).forget(`modules-media-file/r/2400/${fileEntity.id}`)
    await Cache.tags(['modules-media-file']).forget(`modules-media-file/s/50/${fileEntity.id}`)
    await Cache.tags(['modules-media-file']).forget(`modules-media-file/s/600/${fileEntity.id}`)

    this.completed('Modules/Media/Thumbnails', `Generated thumbnails for '${fileEntity.id}'`)
  }
}

module.exports = Thumbnails
