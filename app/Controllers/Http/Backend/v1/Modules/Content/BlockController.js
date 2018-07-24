'use strict'

const Event = use('Event')
const Block = use('App/Models/Modules/Content/Block')
const BlockTransformer = use('App/Transformers/Backend/v1/Modules/Content/BlockTransformer')

class BlockController {
  async index ({transform}) {
    let block = await Block.query()
      .orderBy('published', 'desc')
      .orderBy('title', 'asc')
      .fetch()

    return transform.collection(block, BlockTransformer)
  }

  async show ({params, transform}) {
    let block = await Block.query()
      .where('id', params.id)
      .firstOrFail()

    return transform.item(block, BlockTransformer)
  }

  async store ({request, auth, transform}) {
    let data = {
      ...request.only([
        'title',
        'content',
        'published',
        'author_id'
      ]),
      author_id: auth.user.id
    }

    let block = await Block.create(data)

    Event.fire('event::modules-content-block::new', {
      owner_id: auth.user.id,
      data: block
    })

    return transform.item(block, BlockTransformer)
  }

  async update ({params, request, auth, transform}) {
    let block = await Block.query()
      .where('id', params.id)
      .firstOrFail()

    await block.merge(request.only([
      'title',
      'content',
      'published',
      'author_id'
    ]))
    await block.save()

    Event.fire('event::modules-content-block::update', {
      owner_id: auth.user.id,
      data: block
    })

    return transform.item(block, BlockTransformer)
  }

  async destroy ({params, transform}) {
    let block = await Block.query()
      .where({id: params.id})
      .delete()

    return transform.item(block, BlockTransformer)
  }
}

module.exports = BlockController
