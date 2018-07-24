'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')
const FileTransformer = use('App/Transformers/Public/v1/Modules/Media/FileTransformer')

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
    let author = await model.author().fetch()

    return {
      id: model.id,
      author: author ? author.getFullName() : null,

      title: model.title,
      slug: model.slug,
      description: model.description,
      order: model.order,

      imageCount: await model.imageCount(),

      created_at: model.created_at,
      updated_at: model.updated_at
    }
  }

  async includeCover (model) {
    let cover = model.getRelated('cover')

    if (cover) {
      return this.item(cover, FileTransformer)
    }

    let images = model.getRelated('images').first()

    return this.item(images, FileTransformer)
  }

  async includeImages (model) {
    return this.collection(model.getRelated('images'), FileTransformer)
  }
}

module.exports = GalleryController
