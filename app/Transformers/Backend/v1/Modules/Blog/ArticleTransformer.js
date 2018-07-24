'use strict'

const moment = require('moment')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class ArticleTransformer extends TransformerAbstract {
  availableInclude () {
    return ['content']
  }

  async transform (model) {
    let categories = (await model.categories().fetch()).rows.map(c => c.id)
    let attachments = (await model.attachments().fetch()).rows.map(a => a.id)

    return {
      id: model.id,
      author_id: model.author_id,

      cover_id: model.cover_id,

      title: model.title,
      slug: model.slug,
      type: model.type,

      categories: categories,

      attachments: attachments,

      created_at: moment(model.created_at).toISOString(),
      updated_at: moment(model.updated_at).toISOString(),
      published_at: moment(model.published_at).toISOString(),
      event_at: moment(model.event_at).toISOString()
    }
  }

  includeContent (model) {
    return model.content
  }
}

module.exports = ArticleTransformer
