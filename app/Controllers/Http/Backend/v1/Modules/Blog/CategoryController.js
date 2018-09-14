'use strict'

const Category = use('App/Models/Modules/Blog/Category')
const CategoryTransformer = use('App/Transformers/Backend/v1/Modules/Blog/CategoryTransformer')

class CategoryController {
  async index ({ transform }) {
    let category = Category.query()
      .orderBy('title', 'asc')
      .fetch()

    return transform.collection(category, CategoryTransformer)
  }

  async show ({ params, transform }) {
    let category = await Category.query()
      .where('id', params.id)
      .firstOrFail()

    return transform.item(category, CategoryTransformer)
  }

  async store ({ request, auth, transform }) {
    let data = {
      ...request.only([
        'title'
      ])
    }

    let category = await Category.create(data)

    return transform.item(category, CategoryTransformer)
  }

  async update ({ params, request, auth, transform }) {
    let category = await Category.query()
      .where('id', params.id)
      .firstOrFail()

    await category.merge(request.only(['title']))
    await category.save()

    return transform.item(category, CategoryTransformer)
  }

  async destroy ({ params }) {
    return Category.query()
      .where({ id: params.id })
      .delete()
  }
}

module.exports = CategoryController
