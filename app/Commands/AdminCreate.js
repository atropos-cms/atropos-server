'use strict'

const { Command } = require('@adonisjs/ace')
const User = use('App/Models/User')
const Role = use('App/Models/Role')
const Database = use('Database')

class Install extends Command {
  static get signature () {
    return 'admin:create'
  }

  static get description () {
    return 'Create a new admin user'
  }

  async handle (args, { log, force, silent }) {
    try {
      let adminRole = await this.getAdminRole({ log })
      await this.createAdminUser(adminRole, { log })

      await Database.close()
      process.exit(0)
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }

  async getAdminRole () {
    this.info(`${this.icon('info')} Creating admin role...`)

    let roleEntity = await Role.find({ name: 'Administrators' })

    if (!roleEntity) {
      throw Error('Could not find a Role with name "Administrators" to create this user in.')
    }

    return roleEntity
  }

  async createAdminUser (adminRole) {
    const firstName = await this.ask('Enter firstname', 'Administrator')
    const lastName = await this.ask('Enter lastname')
    const email = await this.ask('Enter email')
    const password = await this.secure('Enter your password')

    let user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      account_status: 'pending',
      activated: true
    })

    await user.roles().attach([adminRole.id])

    this.success(`${this.icon('success')} Created the admin user.`)
  }
}

module.exports = Install
