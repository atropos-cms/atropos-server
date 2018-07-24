const modulesBlogArticle = require('./ModulesBlogArticle')
const modulesContentBlock = require('./ModulesContentBlock')
const modulesContentGallery = require('./ModulesContentGallery')
const modulesFilesObject = require('./ModulesFilesObject')
const modulesMailsMail = require('./ModulesMailsMail')

class EventListenerProcessor {
  constructor (source, type) {
    this.source = source
    this.type = type
    this.eventClass = this._getEventClass(source)
  }

  async getDataForEvent (data) {
    let {data: eventData, ...properties} = data
    const defaultData = Object.assign({...properties}, {
      owner_id: data.owner_id,
      content: null
    })

    if (this.eventClass && eventData) {
      return Object.assign(defaultData, await this.eventClass.processData(this.type, eventData))
    }

    return defaultData
  }

  async updateExistingEvent (data) {
    return data
  }

  async createNewEvent (data) {
    return data
  }

  _getEventClass (source) {
    const modules = {
      modulesBlogArticle,
      modulesContentBlock,
      modulesContentGallery,
      modulesFilesObject,
      modulesMailsMail
    }

    const eventName = source.replace(/(-\w)/g, m => m[1].toUpperCase())

    if (modules.hasOwnProperty(eventName)) {
      return new modules[eventName]()
    }

    return false
  }
}

module.exports = EventListenerProcessor
