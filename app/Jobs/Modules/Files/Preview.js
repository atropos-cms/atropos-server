'use strict'

const Drive = use('Drive')
const Cache = use('Cache')
const Raven = require('raven')
const Job = use('App/Jobs/Job')
const File = use('App/Models/Modules/Files/Object')
const sharp = require('sharp')
const pdf = require('pdf-thumbnail')

class Preview extends Job {
  static get key () {
    return 'modules-files-preview'
  }

  async handle (fileId) {
    await this.init()

    let fileEntity = await File.findOrFail(fileId)

    // if it is a folder, return
    if (fileEntity.kind === 'folder') return

    // get the generator that should be used to generate the preview
    let previewGenerator = this.getPreviewGenerator(fileEntity.mime_type)
    if (!previewGenerator) return

    try {
      // load the file from the store
      const file = await Drive.get(`${fileEntity.drivePath}/${fileEntity.storage_file}`)

      // call the generator
      await this[`generator${previewGenerator}`](file, fileEntity.previewPath())

      this.completed('Modules/Files/Preview', `Generated preview for '${fileEntity.id}'`)
    } catch (error) {
      this.error('Modules/Files/Preview', `Failed to generate preview for '${fileEntity.id}': ${error}`)

      Raven.captureException(error)
    }
    // clear the cache for each thumbnail
    await Cache.tags(['modules-files-object']).forget(`modules-files-preview/${fileEntity.id}`)
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

  async generatorSharp (file, previewPath) {
    let preview = await sharp(file).rotate().resize(300, 300, { fit: 'inside', withoutEnlargement: true }).jpeg()
    await Drive.put(previewPath, preview)
  }

  async generatorPdf (file, previewPath) {
    let preview = await pdf(file, {
      resize: {
        width: 300,
        height: 300
      }
    })

    await Drive.put(previewPath, preview)
  }
}

module.exports = Preview
