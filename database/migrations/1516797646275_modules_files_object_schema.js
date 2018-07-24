'use strict'

const Schema = use('Schema')

class CreateModulesFilesObjectSchema extends Schema {
  up () {
    this.create('modules_files_objects', (table) => {
      table.uuid('id').primary()
      table.string('kind')
      table.string('name').nullable()
      table.string('mime_type').nullable()
      table.text('description')
      table.boolean('trashed')
      table.string('original_filename').nullable()
      table.string('file_extension').nullable()
      table.string('sha256_checksum').nullable()
      table.bigInteger('size').unsigned()
      table.dateTime('modified_at').nullable()

      table.string('upload_token').nullable()
      table.string('storage_file').nullable()

      table.string('status')

      table.uuid('parent_id').nullable()
      table.uuid('team_id')
      table.uuid('owner_id')

      table.timestamps()
    })

    this.create('modules_files_objects_stargazers', (table) => {
      table.increments()
      table.uuid('object_id')
      table.uuid('user_id')
    })
  }

  down () {
    this.drop('modules_files_objects')
    this.drop('modules_files_objects_stargazers')
  }
}

module.exports = CreateModulesFilesObjectSchema
