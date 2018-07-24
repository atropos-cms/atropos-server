'use strict'

const Schema = use('Schema')

class CreateModulesBlogArticleSchema extends Schema {
  up () {
    this.create('modules_blog_articles', (table) => {
      table.uuid('id').primary()
      table.string('title').nullable()
      table.string('slug').nullable()
      table.string('type').nullable()
      table.text('content', 'longtext')
      table.dateTime('published_at').nullable()
      table.dateTime('event_at').nullable()
      table.uuid('author_id')
      table.string('cover_id')
      table.timestamps()
    })

    this.create('modules_blog_articles_versions', (table) => {
      table.increments()
      table.text('diff', 'longtext')
      table.uuid('article_id')
      table.dateTime('created_at').defaultTo(this.fn.now())
    })

    this.create('modules_blog_articles_modules_blog_categories', (table) => {
      table.increments()
      table.uuid('article_id')
      table.uuid('category_id')
    })

    this.create('modules_blog_articles_attachments', (table) => {
      table.increments()
      table.uuid('article_id')
      table.uuid('file_id')
    })
  }

  down () {
    this.drop('modules_blog_articles')
    this.drop('modules_blog_articles_versions')
    this.drop('modules_blog_articles_modules_blog_categories')
    this.drop('modules_blog_articles_attachments')
  }
}

module.exports = CreateModulesBlogArticleSchema
