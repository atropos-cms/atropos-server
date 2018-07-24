'use strict'

const moment = require('moment')
const Event = use('App/Models/Event')
const EventListenerProcessor = require('./EventListenerProcessors')

class EventListener {
  async register (event, data) {
    const [, source, type] = event.split('::')
    const eventListenerProcessor = new EventListenerProcessor(source, type)

    data = await eventListenerProcessor.getDataForEvent(data)

    let recentEvent = await this._recentEvent(data, source, type)

    if (recentEvent) {
      let updateData = Object.assign(data, {
        updated_at: moment(),
        content: data.content
      })

      updateData = await eventListenerProcessor.updateExistingEvent(updateData)

      recentEvent.merge(updateData)
      await this._syncRestricted(recentEvent, {
        restricted_roles: data.restricted_roles,
        restricted_users: data.restricted_users
      })
      return recentEvent.save()
    }

    let newData = {
      owner_id: data.owner_id,
      entity_id: data.entity_id,
      scope: data.scope,
      content: data.content,
      source: source,
      type: type
    }

    newData = await eventListenerProcessor.createNewEvent(newData)

    let eventEntity = await Event.create(newData)
    await this._syncRestricted(eventEntity, {
      restricted_roles: data.restricted_roles,
      restricted_users: data.restricted_users
    })
    return eventEntity
  }

  async _recentEvent (data, source, type) {
    if (!data.entity_id) return false

    let expireDate = Event.formatDates(null, moment().subtract(2, 'hours'))

    return Event.query()
      .where(function () {
        this.where('owner_id', data.owner_id)
          .where('entity_id', data.entity_id)
          .where('source', source)
          .where('type', type)
          .where('updated_at', '>=', expireDate)
      })
      .orWhere(function () {
        this.where('owner_id', data.owner_id)
          .where('entity_id', data.entity_id)
          .where('source', source)
          .where('type', 'new')
          .where('updated_at', '>=', expireDate)
      })
      .first()
  }

  async _syncRestricted (entity, data) {
    if (data.restricted_roles) {
      await entity.restrictedRoles().sync(data.restricted_roles)
    }

    if (data.restricted_users) {
      await entity.restrictedUsers().sync(data.restricted_users)
    }
  }
}

module.exports = EventListener
