const { ServiceProvider } = require('@adonisjs/fold')

class TestingProvider extends ServiceProvider {
  register () {
    // If we are not in testing mode, abort
    if (process.env.NODE_ENV !== 'testing') return

    this.app.singleton('Test/Helpers', (app) => {
      const Helpers = require('../test/helpers')
      return function ({ Context }) {
        Context.getter('helpers', () => Helpers, true)
      }
    })
  }
}

module.exports = TestingProvider
