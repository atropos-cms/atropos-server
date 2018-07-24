'use strict'

const Model = use('Model')

class Block extends Model {
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
    return 'modules_content_block'
  }

  author () {
    return this.belongsTo('App/Models/User', 'author_id')
  }
}

module.exports = Block
