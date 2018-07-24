'use strict'

const Event = use('App/Models/Event')
const EventTransformer = use('App/Transformers/Backend/v1/Administration/EventTransformer')

class EventController {
  async index ({auth, transform}) {
    let userRoles = await auth.user.getMemberOfRoles()

    let events = await Event.query()
      .where(function () {
        this.where('scope', 'public')
      })
      .orWhere(function () {
        this.where('scope', 'restricted')
          .whereHas('restrictedUsers', (builder) => {
            builder.where('users.id', auth.user.id)
          }, '>=', 1)
          .orWhere(function () {
            this.whereHas('restrictedRoles', (builder) => {
              builder.whereIn('roles.id', userRoles)
            }, '>=', 1)
          })
      })
      .orWhere(function () {
        this.where('scope', 'private')
          .where('owner_id', auth.user.id)
      })
      .orderBy('updated_at', 'desc')
      .limit(10)
      .fetch()

    return transform.collection(events, EventTransformer)
  }

  async show ({params, transform}) {
    let event = await Event.query()
      .where('id', params.id)
      .first()

    return transform.item(event, EventTransformer)
  }

  async destroy ({params}) {
    return Event.query()
      .where({id: params.id})
      .delete()
  }
}

module.exports = EventController
