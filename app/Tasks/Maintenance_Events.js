'use strict'

const Task = use('Task')
const moment = require('moment')
const Event = use('App/Models/Event')

const MIN_TOTAL_EVENTS = 200
const MIN_EVENT_AGE = [30, 'days']

class MaintenanceEvents extends Task {
  static get schedule () {
    return '0 */30 * * * *'
  }

  async handle () {
    this.info('Starting maintenance task: MaintenanceEvents')

    let totalEventCount = await Event.getCount()

    if (this.shouldCleanEvents(totalEventCount)) {
      await this.cleanOldEvents(totalEventCount)
    }

    return this.info('Finished: MaintenanceEvents')
  }

  shouldCleanEvents (totalEventCount) {
    return totalEventCount > MIN_TOTAL_EVENTS
  }

  async cleanOldEvents (totalEventCount) {
    let cleanLimit = totalEventCount - MIN_TOTAL_EVENTS

    let events = await Event
      .query()
      .where('created_at', '<', Event.formatDates(null, moment().subtract(MIN_EVENT_AGE[0], MIN_EVENT_AGE[1])))
      .orderBy('created_at', 'asc')
      .limit(cleanLimit)
      .fetch()

    for (let event of events.rows) {
      event.delete()
    }

    this.debug(`Cleaned out ${events.rows.length} events`)
  }
}

module.exports = MaintenanceEvents
