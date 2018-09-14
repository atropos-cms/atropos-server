'use strict'

const Block = use('App/Models/Modules/Content/Block')
const BlockTransformer = use('App/Transformers/Public/v1/Modules/Content/BlockTransformer')

class BlockController {
  async index ({ transform }) {
    let block = await Block.query()
      .where('published', true)
      .fetch()

    return transform.collection(block, BlockTransformer)
  }

  async show ({ params, transform }) {
    let block = await Block.query()
      .where('published', true)
      .where('id', params.id)
      .first()

    return transform.item(block, BlockTransformer)
  }
}

module.exports = BlockController
