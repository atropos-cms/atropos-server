'use strict'

const Schema = use('Schema')

class AddUsesLeftToDownloadTokenSchema extends Schema {
  up () {
    this.table('modules_files_download_tokens', (table) => {
      table.integer('uses_left')
      table.dropColumn('type')
    })
  }

  down () {
    this.table('modules_files_download_tokens', (table) => {
      table.dropColumn('uses_left')
      table.string('type')
    })
  }
}

module.exports = AddUsesLeftToDownloadTokenSchema
