'use strict'

const Factory = use('Factory')
const Database = use('Database')
const faker = require('chance').Chance()

class ModulesContentBlockSeeder {
  async run () {
    const users = await Database.table('users')

    const blocks = await Factory
      .model('App/Models/Modules/Content/Block')
      .createMany(5)

    for (let block of blocks) {
      await block.author().associate(faker.pickone(users))
    }

    console.log('Seeded Modules/Content/Block')
  }
}

module.exports = ModulesContentBlockSeeder
