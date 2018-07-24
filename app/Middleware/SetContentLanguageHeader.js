'use strict'

const Config = use('Config')
const Cache = use('Cache')
const Setting = use('App/Models/Setting')

class SetContentLanguageHeader {
  async handle ({ request, response }, next) {
    // add the content-language header
    response.header('Content-Language', await this.getLocale())

    // call next to advance the request
    await next()
  }

  async getLocale () {
    return Cache.tags(['settings']).remember('settings-locale', 2, async () => {
      let settings = await Setting.query().firstOrFail()
      return settings.locale || Config.get('app.locales.locale')
    })
  }
}

module.exports = SetContentLanguageHeader
