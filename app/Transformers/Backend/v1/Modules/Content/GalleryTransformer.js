'use strict'

const moment = require('moment')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class GalleryController extends TransformerAbstract {
  availableInclude () {
    return [
      'images'
    ]
  }

  defaultInclude () {
    return [
      'cover'
    ]
  }

  async transform (model) {
    return {
      id: model.id,
      author_id: model.author_id,

      title: model.title,
      slug: model.slug,
      description: model.description,
      order: model.order,

      imageCount: await model.imageCount(),

      created_at: moment(model.created_at).toISOString(),
      updated_at: moment(model.updated_at).toISOString(),
      published: !!model.published
    }
  }

  async includeCover (model) {
    let images = model.getRelated('images').toJSON()
    if (images.length === 0) return

    return {
      primary: model.cover_id || images[0].id,
      secondary: images.length >= 2 ? images[1].id : null,
      tertiary: images.length >= 3 ? images[2].id : null
    }
  }

  async includeImages (model) {
    return this.collection(model.getRelated('images'), image => {
      return {
        id: image.id,

        order: image.$relations.pivot.order
      }
    })
  }
}

module.exports = GalleryController
