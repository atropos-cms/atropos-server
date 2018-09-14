'use strict'

const Cache = use('Cache')
const Setting = use('App/Models/Setting')
const SettingTransformer = use('App/Transformers/Backend/v1/Administration/SettingTransformer')

class SettingController {
  async index ({ transform }) {
    let settings = await Setting.query()
      .firstOrFail()

    return transform.item(settings, SettingTransformer)
  }

  async update ({ request, transform }) {
    let settings = await Setting.query()
      .firstOrFail()

    await settings.merge(request.only([
      'developer_mode',
      'locale',
      'branding_abbreviation',
      'branding_name',
      'branding_color',
      'admin_contact',
      'user_contact_id',
      'user_contact_public_access'
    ]))

    await settings.save()

    return transform.item(settings, SettingTransformer)
  }

  async clearCache ({ params, transform }) {
    return Cache.flush()
  }
}

module.exports = SettingController
