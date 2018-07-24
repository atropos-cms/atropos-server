'use strict'

const moment = require('moment')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class BlockController extends TransformerAbstract {
  async transform (model) {
    return {
      id: model.id,
      author_id: model.author_id,

      title: model.title,
      slug: model.slug,
      content: model.content,

      created_at: moment(model.created_at).toISOString(),
      updated_at: moment(model.updated_at).toISOString(),
      published: !!model.published
    }
  }
}

module.exports = BlockController
