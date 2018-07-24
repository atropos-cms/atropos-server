'use strict'

const Schema = use('Schema')

class AddContactAddressToSettingsSchema extends Schema {
  up () {
    this.table('settings', (table) => {
      table.string('admin_contact').nullable()
      table.uuid('user_contact_id').nullable()
      table.boolean('user_contact_public_access').default(false)
    })
  }

  down () {
    this.table('settings', (table) => {
      table.dropColumn('admin_contact')
      table.dropColumn('user_contact_id')
      table.dropColumn('user_contact_public_access')
    })
  }
}

module.exports = AddContactAddressToSettingsSchema
