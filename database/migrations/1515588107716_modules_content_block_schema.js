'use strict'

const Schema = use('Schema')

class CreateModulesContentBlockSchema extends Schema {
  up () {
    this.create('modules_content_block', (table) => {
      table.uuid('id').primary()
      table.string('title').nullable()
      table.string('slug').nullable()
      table.text('content', 'longtext')
      table.boolean('published').default(false)
      table.uuid('author_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('modules_content_block')
  }
}

module.exports = CreateModulesContentBlockSchema
