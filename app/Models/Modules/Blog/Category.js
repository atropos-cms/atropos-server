'use strict'

const Model = use('Model')

class Category extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')
  }

  static get incrementing () {
    return false
  }

  static get table () {
    return 'modules_blog_categories'
  }

  articles () {
    return this.belongsToMany('App/Models/Modules/Blog/Articles').pivotTable('modules_blog_articles_modules_blog_categories')
  }
}

module.exports = Category
