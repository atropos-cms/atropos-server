'use strict'

const Model = use('Model')

class Statistic extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')
  }

  static get updatedAtColumn () {
    return null
  }

  static get incrementing () {
    return false
  }

  static async latest ({ id, source, type } = {}) {
    let query = Statistic.query()

    if (id === undefined) {
      query.whereNull('entity_id')
    } else {
      query.where('entity_id', id)
    }

    let latest = await query
      .where('source', source)
      .where('type', type)
      .orderBy('created_at', 'desc')
      .pickInverse()

    return latest.rows.length ? latest.rows[0] : null
  }

  static async latestAmount ({ id, source, type } = {}) {
    let latest = await Statistic.latest({ id, source, type })
    return latest ? latest.amount : null
  }
}

module.exports = Statistic
