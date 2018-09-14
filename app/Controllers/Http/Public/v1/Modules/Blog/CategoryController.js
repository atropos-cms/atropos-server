'use strict'

const Category = use('App/Models/Modules/Blog/Category')
const CategoryTransformer = use('App/Transformers/Public/v1/Modules/Blog/CategoryTransformer')

class CategoryController {
  async index ({ transform }) {
    let categories = Category.query()
      .fetch()

    return transform.collection(categories, CategoryTransformer)
  }

  async show ({ params, transform }) {
    let category = await Category.query()
      .where('id', params.id)
      .first()

    return transform.item(category, CategoryTransformer)
  }
}

module.exports = CategoryController
