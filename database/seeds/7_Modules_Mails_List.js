'use strict'

const Factory = use('Factory')
const Database = use('Database')
const faker = require('chance').Chance()

class ModulesMailsListSeeder {
  async run () {
    const users = await Database.table('users')
    const roles = await Database.table('roles')

    let lists = await Factory
      .model('App/Models/Modules/Mails/List')
      .createMany(3)

    for (let list of lists) {
      let _users = faker.pick(users, 2)
      await list.users().attach(_users.map(u => u.id))

      let _role = faker.pick(roles, 1)
      await list.roles().attach(_role.id)
    }

    console.log('Seeded Modules/Mails/List')
  }
}

module.exports = ModulesMailsListSeeder
