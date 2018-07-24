'use strict'

const Setting = use('App/Models/Setting')
const faker = require('chance').Chance()

class SettingsSeeder {
  async run () {
    await Setting.create({
      developer_mode: false,
      locale: 'en',
      branding_abbreviation: faker.letter({casing: 'upper'}),
      branding_name: faker.animal(),
      branding_color: faker.color({format: 'hex'})
    })

    console.log('Seeded Settings')
  }
}

module.exports = SettingsSeeder
