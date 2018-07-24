'use strict'

const Schema = use('Schema')

class CreateSettingsSchema extends Schema {
  up () {
    this.create('settings', (table) => {
      table.uuid('id').primary()
      table.boolean('developer_mode').default(false)
      table.string('locale').nullable()
      table.string('branding_abbreviation').nullable()
      table.string('branding_name').nullable()
      table.string('branding_color').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('settings')
  }
}

module.exports = CreateSettingsSchema
