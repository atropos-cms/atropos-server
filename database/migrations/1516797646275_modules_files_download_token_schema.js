'use strict'

const Schema = use('Schema')

class CreateModulesFilesDownloadTokenSchema extends Schema {
  up () {
    this.create('modules_files_download_tokens', (table) => {
      table.uuid('id').primary()

      table.uuid('team_id')
      table.uuid('object_id')
      table.uuid('owner_id')

      table.string('type')
      table.string('status')

      table.dateTime('used_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('modules_files_download_tokens')
  }
}

module.exports = CreateModulesFilesDownloadTokenSchema
