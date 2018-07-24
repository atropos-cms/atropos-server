'use strict'

const Gallery = use('App/Models/Modules/Content/Gallery')
const GalleryTransformer = use('App/Transformers/Public/v1/Modules/Content/GalleryTransformer')

class GalleryController {
  async index ({transform}) {
    let gallery = await Gallery.query()
      .with('images')
      .where('published', true)
      .has('images')
      .fetch()

    return transform.collection(gallery, GalleryTransformer)
  }

  async show ({params, transform}) {
    let gallery = await Gallery.query()
      .where('published', true)
      .where('id', params.id)
      .orWhere('slug', params.id)
      .has('images')
      .with('images')
      .first()

    return transform.include('images').item(gallery, GalleryTransformer)
  }
}

module.exports = GalleryController
