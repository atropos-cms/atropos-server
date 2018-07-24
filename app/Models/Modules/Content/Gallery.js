'use strict'

const Model = use('Model')

class Gallery extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')

    this.addTrait('@provider:Lucid/Slugify', {
      fields: { slug: 'title' },
      strategy: 'dbIncrement'
    })
  }

  static get incrementing () {
    return false
  }

  static get table () {
    return 'modules_content_gallery'
  }

  author () {
    return this.belongsTo('App/Models/User', 'author_id')
  }

  cover () {
    return this.belongsTo('App/Models/Modules/Media/File', 'cover_id')
  }

  images () {
    return this.belongsToMany('App/Models/Modules/Media/File')
      .withPivot(['description', 'order'])
      .pivotTable('modules_content_gallery_images')
  }

  async imageCount () {
    return this.images().getCount()
  }
}

module.exports = Gallery
