'use strict'

const Raven = require('raven')
const { version } = require('../package.json')
const { ServiceProvider } = require('@adonisjs/fold')

class SentryProvider extends ServiceProvider {
  register () {
    const Env = use('Env')

    if (!Env.get('SENTRY_DSN')) return

    Raven.config(Env.get('SENTRY_DSN'), {
      release: version
    }).install()
  }

  boot () {
    // optionally do some intial setup
  }
}

module.exports = SentryProvider
