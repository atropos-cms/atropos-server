'use strict'

const { Command } = require('@adonisjs/ace')
const requireAll = require('require-all')
const User = use('App/Models/User')
const Role = use('App/Models/Role')
const Permission = use('App/Models/Permission')
const Database = use('Database')
const Setting = use('App/Models/Setting')

class Install extends Command {
  static get signature () {
    return 'install'
  }

  static get description () {
    return 'Installs the atropos application'
  }

  static get inject () {
    return ['Adonis/Src/Migration', 'Adonis/Src/Helpers']
  }

  constructor (migration, helpers) {
    super()
    this._migrationsPath = helpers.migrationsPath()
    this.migration = migration
  }

  async handle (args, { log, force, silent }) {
    try {
      this._validateState(force)
      // general setup
      await this.migrateDatabase({ log })
      await this.runSetup({ log })

      // create the first admin user
      let adminRole = await this.createAdminRole({ log })
      await this.createAdminUser(adminRole, { log })

      // create a role for normal users
      await this.createUserRole({ log })

      await Database.close()
      process.exit(0)
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }

  async migrateDatabase ({ log }) {
    this.info(`${this.icon('info')} Migrating Database....`)

    const migrations = await this.migration.status(this._getSchemaFiles())
    const databaseIsEmpty = migrations.reduce((accumulator, migration) => accumulator && !migration.migrated, true)

    if (!databaseIsEmpty) {
      this.failed('migration', 'This database already contains an atropos installation.')
      process.exit(1)
    }

    const { status } = await this.migration.up(this._getSchemaFiles(), log)

    /**
     * Log files that been migrated successfully
     */
    if (status === 'completed') {
      this.success(`${this.icon('success')} Database migrated successfully.`)
    }
  }

  async runSetup () {
    this.info(`${this.icon('info')} Configuring initial settings...`)

    await Setting.create({
      developer_mode: false
    })

    this.success(`${this.icon('success')} Finished initial setup.`)
  }

  async createAdminRole () {
    this.info(`${this.icon('info')} Creating admin role...`)

    const rolesSeedData = require(`${this._migrationsPath}/../seed-data/Roles`)
    const adminRole = rolesSeedData.find(r => r.name === 'Administrators')

    let roleEntity = await Role.create({
      name: adminRole.name
    })

    for (let p of adminRole.permissions) {
      const permission = await Permission.findOrCreate({ name: p })
      await roleEntity.permissions().save(permission)
    }

    this.success(`${this.icon('success')} Created the admin role.`)

    return roleEntity
  }

  async createUserRole () {
    this.info(`${this.icon('info')} Creating user role...`)

    const rolesSeedData = require(`${this._migrationsPath}/../seed-data/Roles`)
    const userRole = rolesSeedData.find(r => r.name === 'Users')

    let roleEntity = await Role.create({
      name: userRole.name
    })

    for (let p of userRole.permissions) {
      const permission = await Permission.findOrCreate({ name: p })
      await roleEntity.permissions().save(permission)
    }

    this.success(`${this.icon('success')} Created the user role.`)

    return roleEntity
  }

  async createAdminUser (adminRole) {
    this.info('We will now create your admin user.')

    const firstName = await this.ask('Enter firstname', 'Administrator')
    const lastName = await this.ask('Enter lastname')
    const email = await this.ask('Enter email')
    const password = await this.secure('Enter your password')

    let user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      account_status: 'active',
      activated: true
    })

    await user.roles().attach([adminRole.id])

    this.success(`${this.icon('success')} Created the admin user.`)
  }

  /**
   * Returns an object of all schema files
   *
   * @method _getSchemaFiles
   *
   * @return {Object}
   *
   * @private
   */
  _getSchemaFiles () {
    return requireAll({
      dirname: this._migrationsPath,
      filters: /(.*)\.js$/
    })
  }

  /**
   * Throws exception when trying to run migrations are
   * executed in production and not using force flag.
   *
   * @method _validateState
   *
   * @param  {Boolean}       force
   *
   * @return {void}
   *
   * @private
   *
   * @throws {Error} If NODE_ENV is production
   */
  _validateState (force) {
    if (process.env.NODE_ENV === 'production' && !force) {
      throw new Error('Cannot run migrations in production. Use --force flag to continue')
    }
  }
}

module.exports = Install
