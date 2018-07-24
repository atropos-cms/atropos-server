'use strict'

const git = require('git-rev-sync')
const packageJSON = require('../../../../../package.json')
var gitVersionSha = null

class AuthController {
  async index ({request, response}) {
    gitVersionSha = gitVersionSha || git.short()

    return {
      service_sha: gitVersionSha,
      api: packageJSON.version,
      server_status: 'OK'
    }
  }
}

module.exports = AuthController
