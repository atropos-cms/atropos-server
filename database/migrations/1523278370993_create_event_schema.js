'use strict'

const Schema = use('Schema')

class CreateEventSchema extends Schema {
  up () {
    this.create('events', (table) => {
      table.uuid('id').primary()
      table.uuid('owner_id')
      table.uuid('entity_id').nullable()

      table.string('scope')

      table.string('source')
      table.string('type')

      table.string('link').nullable()

      table.json('content').nullable()

      this.create('events_restricted_users', (table) => {
        table.increments()
        table.uuid('event_id')
        table.uuid('user_id')
      })
      this.create('events_restricted_roles', (table) => {
        table.increments()
        table.uuid('event_id')
        table.uuid('role_id')
      })

      table.timestamps()
    })
  }

  down () {
    this.drop('events')
    this.drop('events_restricted_users')
    this.drop('events_restricted_roles')
  }
}

module.exports = CreateEventSchema
