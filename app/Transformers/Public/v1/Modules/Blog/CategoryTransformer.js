'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class CategoryTransformer extends TransformerAbstract {
  async transform (model) {
    return {
      id: model.id,

      title: model.title
    }
  }
}

module.exports = CategoryTransformer
