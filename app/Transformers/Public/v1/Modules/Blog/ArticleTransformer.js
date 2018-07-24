'use strict'

const truncate = require('truncate')
const striptags = require('striptags')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')
const FileTransformer = use('App/Transformers/Public/v1/Modules/Media/FileTransformer')

class ArticleTransformer extends TransformerAbstract {
  availableInclude () {
    return ['content']
  }

  defaultInclude () {
    return ['attachments', 'cover']
  }

  async transform (model) {
    let categories = (await model.categories().fetch()).rows.map(category => category.id)

    let author = await model.author().fetch()

    let summary = truncate(striptags(model.content).replace('&nbsp;', ' '), 200)

    return {
      id: model.id,
      author: author ? author.getFullName() : null,

      title: model.title,
      slug: model.slug,
      type: model.type,
      summary: summary,

      categories: categories,

      created_at: model.created_at,
      updated_at: model.updated_at,
      published_at: model.published_at,
      event_at: model.event_at
    }
  }

  includeContent (model) {
    return model.content
  }

  async includeAttachments (model) {
    let attachments = await model.attachments().fetch()

    return this.collection(attachments, FileTransformer)
  }

  async includeCover (model) {
    let cover = await model.cover().fetch()

    return this.item(cover, FileTransformer)
  }
}

module.exports = ArticleTransformer
