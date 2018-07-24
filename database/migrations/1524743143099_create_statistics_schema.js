'use strict'

const Schema = use('Schema')

class CreateStatisticsSchema extends Schema {
  up () {
    this.create('statistics', (table) => {
      table.uuid('id').primary()
      table.uuid('entity_id').nullable()

      table.string('scope').nullable()

      table.string('source').nullable()
      table.string('type').nullable()

      table.bigInteger('amount').unsigned()

      table.json('data').nullable()

      table.dateTime('created_at').nullable()
    })
  }

  down () {
    this.drop('statistics')
  }
}

module.exports = CreateStatisticsSchema
