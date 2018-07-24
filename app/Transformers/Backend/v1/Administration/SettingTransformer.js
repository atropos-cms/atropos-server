'use strict'

const moment = require('moment')
const Statistic = use('App/Models/Statistic')
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class SettingTransformer extends TransformerAbstract {
  availableInclude () {
    return [
      'stats'
    ]
  }

  async transform (model) {
    return {
      developer_mode: !!model.developer_mode,
      locale: model.locale,
      branding_abbreviation: model.branding_abbreviation,
      branding_name: model.branding_name,
      branding_color: model.branding_color,
      admin_contact: model.admin_contact,
      user_contact_id: model.user_contact_id,
      user_contact_public_access: !!model.user_contact_public_access
    }
  }

  async includeStats (model) {
    let totalStorage = await Statistic.latest({
      source: 'system',
      type: 'storage'
    })

    let mediaStorage = await Statistic.latestAmount({
      source: 'modules-media-files',
      type: 'storage'
    })

    let filesTeams = await Statistic.latestAmount({
      source: 'modules-files-teams',
      type: 'storage'
    })

    return {
      updated_at: totalStorage ? moment(totalStorage.created_at).toISOString() : null,
      totalStorage: totalStorage ? totalStorage.amount : null,
      mediaFiles: mediaStorage,
      filesTeams: filesTeams
    }
  }
}

module.exports = SettingTransformer
