'use strict'

const moment = require('moment')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class CategoryTransformer extends TransformerAbstract {
  async transform (model) {
    return {
      id: model.id,

      title: model.title,

      created_at: moment(model.created_at).toISOString(),
      updated_at: moment(model.updated_at).toISOString()
    }
  }
}

module.exports = CategoryTransformer
