'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class AppProvider extends ServiceProvider {
  async register () {
  }

  boot () {
    // Disable event listeners count to prevent warning about memory leak
    // 0 = infinite listeners
    require('events').EventEmitter.prototype._maxListeners = 0
  }
}

module.exports = AppProvider
