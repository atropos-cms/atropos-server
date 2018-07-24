'use strict'

const Schema = use('Schema')

class CreateModulesMediaFilesSchema extends Schema {
  up () {
    this.create('modules_media_files', (table) => {
      table.uuid('id').primary()
      table.string('name').nullable()
      table.string('mime_type').nullable()
      table.text('description')

      table.string('original_filename').nullable()
      table.string('file_extension').nullable()
      table.string('sha256_checksum').nullable()
      table.bigInteger('size').unsigned()

      table.string('upload_token').nullable()
      table.string('storage_file').nullable()

      table.boolean('browsable')
      table.boolean('trashed')
      table.string('status')

      table.uuid('owner_id')

      table.json('exif').nullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('modules_media_files')
  }
}

module.exports = CreateModulesMediaFilesSchema
