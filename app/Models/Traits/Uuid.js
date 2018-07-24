'use strict'

const uuidV4 = require('uuid/v4')

class Uuid {
  register (Model, customOptions = {}) {
    Model.addHook('beforeCreate', async (modelInstance) => {
      modelInstance.id = uuidV4()
    })
  }
}

module.exports = Uuid
