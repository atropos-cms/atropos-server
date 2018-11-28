'use strict'

const Drive = use('Drive')
const Cache = use('Cache')
const Job = use('App/Jobs/Job')
const sharp = require('sharp')
const pdf = require('pdf-thumbnail')

class Thumbnails extends Job {
  static get key () {
    return 'modules-media-thumbnails'
  }

  async handle (fileEntity) {
    await this.init()

    // get the generator that should be used to generate the preview
    let previewGenerator = this.getPreviewGenerator(fileEntity.mime_type)
    if (!previewGenerator) return

    try {
      // load the file from the store
      const file = await Drive.get(`media/${fileEntity.storage_file}`)

      // call the generator
      await this[`generator${previewGenerator}`](file, fileEntity.storage_file)
    } catch (error) {
      this.error('Modules/Media/Thumbnails', `Failed to generate thumbnails for '${fileEntity.id}': ${error}`)
    }

    // clear the cache for each thumbnail
    await Cache.tags(['modules-media-file']).forget(`modules-media-file/r/600/${fileEntity.id}`)
    await Cache.tags(['modules-media-file']).forget(`modules-media-file/r/1200/${fileEntity.id}`)
    await Cache.tags(['modules-media-file']).forget(`modules-media-file/r/2400/${fileEntity.id}`)
    await Cache.tags(['modules-media-file']).forget(`modules-media-file/s/50/${fileEntity.id}`)
    await Cache.tags(['modules-media-file']).forget(`modules-media-file/s/600/${fileEntity.id}`)

    this.completed('Modules/Media/Thumbnails', `Generated thumbnails for '${fileEntity.id}'`)
  }

  getPreviewGenerator (mimeType) {
    switch (mimeType) {
      case 'image/jpeg':
        return 'Sharp'

      case 'image/png':
        return 'Sharp'

      case 'application/pdf':
        return 'Pdf'

      default:
        return false
    }
  }

  async generatorSharp (file, path) {
    // create thumbnails for all sizes
    let r600 = await sharp(file).rotate().resize(600, 600, { fit: 'inside', withoutEnlargement: true })
    let r1200 = await sharp(file).rotate().resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    let r2400 = await sharp(file).rotate().resize(2400, 2400, { fit: 'inside', withoutEnlargement: true })
    let s50 = await sharp(file).rotate().resize(50, 50)
    let s600 = await sharp(file).rotate().resize(600, 600, { fit: 'inside', withoutEnlargement: true })

    // upload thumbnails in parallel
    await Promise.all([
      Drive.put(`media/r/600/${path}`, r600),
      Drive.put(`media/r/1200/${path}`, r1200),
      Drive.put(`media/r/2400/${path}`, r2400),
      Drive.put(`media/s/50/${path}`, s50),
      Drive.put(`media/s/600/${path}`, s600)
    ])
  }

  async generatorPdf (file, path) {
    // create thumbnails for all sizes
    let r600 = await pdf(file, { resize: { width: 600, height: 600 } })
    let r1200 = await pdf(file, { resize: { width: 1200, height: 1200 } })
    let r2400 = await pdf(file, { resize: { width: 2400, height: 2400 } })
    let s50 = await pdf(file, { resize: { width: 50, height: 50 } })
    let s600 = await pdf(file, { resize: { width: 600, height: 600 } })

    // upload thumbnails in parallel
    await Promise.all([
      Drive.put(`media/r/600/${path}`, r600),
      Drive.put(`media/r/1200/${path}`, r1200),
      Drive.put(`media/r/2400/${path}`, r2400),
      Drive.put(`media/s/50/${path}`, s50),
      Drive.put(`media/s/600/${path}`, s600)
    ])
  }
}

module.exports = Thumbnails
