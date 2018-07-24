'use strict'

const Schema = use('Schema')

class CreateModulesContentGallerySchema extends Schema {
  up () {
    this.create('modules_content_gallery', (table) => {
      table.uuid('id').primary()
      table.string('title').nullable()
      table.string('slug').nullable()
      table.text('description')
      table.boolean('published').default(false)
      table.integer('order').nullable()
      table.uuid('author_id')
      table.uuid('cover_id').nullable()
      table.timestamps()
    })

    this.create('modules_content_gallery_images', (table) => {
      table.increments()
      table.uuid('gallery_id')
      table.uuid('file_id')
      table.text('description').nullable()
      table.integer('order').nullable()
    })
  }

  down () {
    this.drop('modules_content_gallery')
    this.drop('modules_content_gallery_images')
  }
}

module.exports = CreateModulesContentGallerySchema
