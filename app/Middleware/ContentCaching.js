'use strict'

const crypto = require('crypto')
const Cache = use('Cache')
const Setting = use('App/Models/Setting')

class ContentCaching {
  async handle ({ request, response }, next) {
    // If we are in testing mode, we do not want to cache content
    if (process.env.NODE_ENV === 'testing') return next()

    // If developer-mode is active, we do not want to cache content
    if (await this.isInDeveloperMode()) return next()

    // create the cache-key that will be used to cache the response
    const cacheKey = await this.getCacheKeyFromRequest(request)

    // remember the response for 5 minutes if in the cache.
    // Otherwise execute the request and cache the response content for next time
    const cachedResponse = await Cache.tags(['content-cache']).remember(cacheKey, 5, async () => {
      await next()
      return response._lazyBody.content
    })

    // set the content to the response
    response._lazyBody.content = cachedResponse
  }

  async isInDeveloperMode () {
    return Cache.tags(['settings']).remember('settings-developer-mode', 2, async () => {
      let settings = await Setting.query().firstOrFail()
      return settings.developer_mode
    })
  }

  async getCacheKeyFromRequest (request) {
    const hash = crypto.createHash('sha256')

    hash.update(`url:${request.url()}-params:${JSON.stringify(request.params)}`)

    return `content-cache: ${hash.digest('hex')}`
  }
}

module.exports = ContentCaching
