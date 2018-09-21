'use strict'

const Event = use('Event')
const Gallery = use('App/Models/Modules/Content/Gallery')
const GalleryTransformer = use('App/Transformers/Backend/v1/Modules/Content/GalleryTransformer')

class GalleryController {
  async index ({ transform }) {
    let gallery = await Gallery.query()
      .with('images')
      .orderBy('order', 'asc')
      .orderBy('title', 'asc')
      .fetch()

    return transform.collection(gallery, GalleryTransformer)
  }

  async show ({ params, transform }) {
    let gallery = await Gallery.query()
      .where('id', params.id)
      .firstOrFail()

    return transform.include('images').item(gallery, GalleryTransformer)
  }

  async store ({ auth, request, transform }) {
    let data = {
      ...request.only([
        'title',
        'description',
        'published',
        'author_id'
      ]),
      author_id: auth.user.id
    }

    let gallery = await Gallery.create(data)

    Event.fire('event::modules-content-gallery::new', {
      owner_id: auth.user.id,
      data: gallery
    })

    return transform.include('images').item(gallery, GalleryTransformer)
  }

  async update ({ params, request, auth, transform }) {
    let gallery = await Gallery.query()
      .where('id', params.id)
      .firstOrFail()

    await gallery.merge(request.only([
      'title',
      'description',
      'author_id',
      'published',
      'slug',
      'order'
    ]))

    await this._updateImagesOnGallery(request, gallery)

    await gallery.save()

    // Only log change event anything else than order changed.
    // this prevents triggering an update if we reorder the galleries
    if (Object.keys(request.except(['id', 'order'])).length > 0) {
      Event.fire('event::modules-content-gallery::update', {
        owner_id: auth.user.id,
        data: gallery
      })
    }

    return transform.include('images').item(gallery, GalleryTransformer)
  }

  async destroy ({ params, transform }) {
    await Gallery.query()
      .where({ id: params.id })
      .delete()
  }

  async _updateImagesOnGallery (request, gallery) {
    let images = request.only(['images']).images || null

    if (!images) return

    images = images.map(i => i.id || i)
    let cover = request.only(['cover']).cover

    let primaryCover
    if (cover && images.includes(cover.primary)) {
      primaryCover = cover.primary
    } else {
      primaryCover = images.length >= 1 ? images[0] : null
    }

    await gallery.merge({ cover_id: primaryCover })

    await gallery.images().detach()
    await gallery.images().attach(images, row => {
      let image = images.find(i => i.id === row.file_id)
      row.order = image ? image.order : 0
    })
  }
}

module.exports = GalleryController
