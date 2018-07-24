'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class BlockController extends TransformerAbstract {
  async transform (model) {
    let author = await model.author().fetch()

    return {
      id: model.id,
      author: author ? author.getFullName() : null,

      title: model.title,
      slug: model.slug,
      content: model.content,

      created_at: model.created_at,
      updated_at: model.updated_at
    }
  }
}

module.exports = BlockController
