'use strict'

const Statistic = use('App/Models/Statistic')

class StatsListener {
  async register (event, data) {
    const [, source, type] = event.split('::')

    let newData = {
      entity_id: data.entity_id,
      scope: data.scope || 'backend',
      data: data.data,
      source: source,
      type: type,
      amount: data.amount || 1
    }

    let statEntity = await Statistic.create(newData)
    return statEntity
  }
}

module.exports = StatsListener
