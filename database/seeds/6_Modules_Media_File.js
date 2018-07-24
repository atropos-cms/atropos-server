'use strict'

const Drive = use('Drive')

class ModulesMediaFileSeeder {
  async run () {
    await Drive.delete(`media`)

    console.log('Deleted all files in /media')
  }
}

module.exports = ModulesMediaFileSeeder
