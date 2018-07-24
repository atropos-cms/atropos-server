'use strict'

const Role = use('App/Models/Role')
const User = use('App/Models/User')
const Permission = use('App/Models/Permission')
const rolesSeedData = require('../seed-data/Roles')

class RolesSeeder {
  async run () {
    for (let role of rolesSeedData) {
      let roleEntity = await Role.create({
        name: role.name
      })

      for (let u of role.users) {
        const user = await User.findBy('email', u)
        await roleEntity.members().save(user)
      }

      for (let p of role.permissions) {
        const permission = await Permission.findOrCreate({ name: p })
        await roleEntity.permissions().save(permission)
      }
    }

    console.log('Seeded Roles')
  }
}

module.exports = RolesSeeder
