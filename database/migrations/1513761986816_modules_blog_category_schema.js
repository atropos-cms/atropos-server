'use strict'

const Schema = use('Schema')

class CreateModulesBlogCategorySchema extends Schema {
  up () {
    this.create('modules_blog_categories', (table) => {
      table.uuid('id').primary()
      table.string('title').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('modules_blog_categories')
  }
}

module.exports = CreateModulesBlogCategorySchema
