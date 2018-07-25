'use strict'

class PresenceController {
  constructor ({ socket, request, auth }) {
    this.socket = socket
    this.request = request
    this.user = auth.user
  }

  onNavigation (data) {
    this.user.merge({last_action: new Date()})
    this.user.save()
  }
}

module.exports = PresenceController
