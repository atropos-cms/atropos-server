'use strict'

const Factory = use('Factory')
const Database = use('Database')
const faker = require('chance').Chance()

class ModulesFilesTeamSeeder {
  async run () {
    const users = await Database.table('users')
    const roles = await Database.table('roles')

    let teams = await Factory
      .model('App/Models/Modules/Files/Team')
      .createMany(3)

    for (let team of teams) {
      let _users = faker.pick(users, 3)
      await team.users().attach(_users.map(u => u.id))

      let _role = faker.pick(roles, 1)
      await team.roles().attach(_role.id)
    }

    console.log('Seeded Modules/Files/Team')
  }
}

module.exports = ModulesFilesTeamSeeder
