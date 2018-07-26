'use strict'

const path = require('path')
const { Command } = require('@adonisjs/ace')

class KeyGenerate extends Command {
  /**
   * The command signature used by ace
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    key:generate
    { -f, --force: Forcefully generate the key in production environment }
    { --env=@value: .env file location }
    { -s, --size=@value: The key size which defaults to 64 characters }
    { --echo: Echo the key instead of writing to the file }
    `
  }

  /**
   * The command description used by ace
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Generate secret key for the app'
  }

  /**
   * Reads the content of `.env` file and returns it as
   * an object
   *
   * @method getEnvContent
   *
   * @param  {String}      envPath
   *
   * @return {Object}
   */
  async getEnvContent (envPath) {
    const dotEnvContents = await this.readFile(envPath)
    return require('dotenv').parse(dotEnvContents)
  }

  /**
   * Updates the `.env` file by converting the object back
   * to a valid string
   *
   * @method updateEnvContents
   *
   * @param  {String}          envPath
   * @param  {Object}          envHash
   *
   * @return {void}
   */
  async updateEnvContents (envPath, envHash) {
    const updatedContents = Object.keys(envHash).map((key) => {
      return `${key}=${envHash[key]}`
    }).join('\n')

    await this.writeFile(envPath, updatedContents)
  }

  /**
   * Invokes a function, by automatically catching for errors
   * and printing them in a standard way
   *
   * @method invoke
   *
   * @param  {Function} callback
   *
   * @return {void}
   */
  async invoke (callback) {
    try {
      await callback()
    } catch (error) {
      this.printError(error)
      process.exit(1)
    }
  }

  /**
   * Prints error object to the console
   *
   * @method printError
   *
   * @param  {Object}   error
   *
   * @return {void}
   */
  printError (error) {
    console.log(`\n  ${this.chalk.bgRed(' ERROR ')} ${error.message}\n`)

    if (error.hint) {
      console.log(`\n  ${this.chalk.bgRed(' HELP ')} ${error.hint}\n`)
    }
  }

  /**
   * Throws exception when user is not inside the project root
   *
   * @method ensureInProjectRoot
   *
   * @return {void}
   */
  async ensureInProjectRoot () {
    const exists = await this.pathExists(path.join(process.cwd(), 'ace'))
    if (!exists) {
      throw new Error(`Make sure you are inside an adonisjs app to run the ${this.constructor.commandName} command`)
    }
  }

  /**
   * Throws error when NODE_ENV = production and `--force` flag
   * has not been passed.
   *
   * @method ensureCanRunInProduction
   *
   * @param  {Object}                 options
   *
   * @return {void}
   */
  ensureCanRunInProduction (options) {
    if (process.env.NODE_ENV === 'production' && !options.force) {
      throw new Error(`Cannot run ${this.constructor.commandName} command in production. Pass --force flag to continue`)
    }
  }

  /**
   * Invoked by ace
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Object} options
   *
   * @return {void}
   */
  async handle (args, options) {
    const size = options.size ? Number(options.size) : 64
    const key = require('randomstring').generate(size)

    /**
     * Echo key to console when echo is set to true
     * and return
     */
    if (options.echo) {
      console.log(`APP_KEY=${key}`)
      return
    }

    await this.invoke(async () => {
      this.ensureCanRunInProduction(options)
      await this.ensureInProjectRoot()

      const env = options.env || '.env'
      const pathToEnv = path.isAbsolute(env) ? env : path.join(process.cwd(), env)

      const envHash = await this.getEnvContent(pathToEnv)
      await this.updateEnvContents(pathToEnv, Object.assign(envHash, { APP_KEY: key }))

      this.completed('generated', 'unique APP_KEY')
    })
  }
}

module.exports = KeyGenerate
