'use strict'

const Event = use('Event')
const { resolver } = require('@adonisjs/fold')

// Register the general event for 'Event'
// Need to resolve this manually since adonis will not pass the event property
// to a Class based event
Event.on('event::**', async function (data) {
  const { method } = resolver.forDir('listeners').resolveFunc('EventListener.register')
  method(this.event, data)
})

// Register the general event for 'Stats'
Event.on('stats::**', async function (data) {
  const { method } = resolver.forDir('listeners').resolveFunc('StatsListener.register')
  method(this.event, data)
})

Event.on('email::changed', 'PersonaListener.sendEmailVerification')
Event.on('email::send-verification', 'PersonaListener.sendEmailVerification')
Event.on('password::changed', 'PersonaListener.sendPasswordChanged')
Event.on('forgot::password', 'PersonaListener.sendPasswordResetEmail')
Event.on('forgot::failed', 'PersonaListener.sendUserNotFoundEmail')
Event.on('user::created', 'PersonaListener.sendAccountCreatedEmail')
