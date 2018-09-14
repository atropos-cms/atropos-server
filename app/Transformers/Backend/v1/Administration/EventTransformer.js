'use strict'

const moment = require('moment')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class EventTransformer extends TransformerAbstract {
  async transform (model, { request }) {
    return {
      id: model.id,

      owner_id: model.owner_id,
      entity_id: model.entity_id,
      scope: model.scope,

      source: model.source,
      type: model.type,
      link: model.link,
      content: JSON.parse(model.content),

      created_at: moment(model.created_at).toISOString(),
      updated_at: moment(model.updated_at).toISOString()
    }
  }
}

module.exports = EventTransformer
