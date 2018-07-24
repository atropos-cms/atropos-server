'use strict'

const Model = use('Model')

class Article extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')

    this.addTrait('@provider:Lucid/Slugify', {
      fields: { slug: 'title' },
      strategy: 'dbIncrement',
      disableUpdates: true
    })
  }

  static get incrementing () {
    return false
  }

  static get table () {
    return 'modules_blog_articles'
  }

  static get dates () {
    return super.dates.concat(['published_at', 'event_at'])
  }

  author () {
    return this.belongsTo('App/Models/User', 'author_id')
  }

  categories () {
    return this.belongsToMany('App/Models/Modules/Blog/Category').pivotTable('modules_blog_articles_modules_blog_categories')
  }

  cover () {
    return this.belongsTo('App/Models/Modules/Media/File', 'cover_id')
  }

  attachments () {
    return this.belongsToMany('App/Models/Modules/Media/File').pivotTable('modules_blog_articles_attachments')
  }
}

module.exports = Article
