'use strict'

const Raven = require('raven')
const Env = use('Env')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    response.status(error.status).send({ error: { message: error.message } })
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request, auth }) {
    if (!this.shouldReport(error)) return

    // Add some user data to the error log
    if (auth.user) {
      Raven.mergeContext({
        user: {
          id: auth.user.id,
          first_name: auth.user.first_name,
          last_name: auth.user.last_name,
          activated: !!auth.user.activated,
          email: auth.user.email,
          created_at: auth.user.created_at
        }
      })
    }

    // Add the request data
    Raven.mergeContext({
      request: request.request
    })

    // Submit the exception to sentry
    Raven.captureException(error)
  }

  /**
   * Determen if this error should be reported.
   *
   * @method shouldReport
   *
   * @param  {Object} error
   *
   * @return {boolean}
   */
  shouldReport (error) {
    if (!Env.get('SENTRY_DSN')) return

    // Ignore errors if...

    // someone has an expired token.
    if (error.code === 'E_INVALID_JWT_TOKEN') return false

    // report all remaining errors
    return true
  }
}

module.exports = ExceptionHandler
