'use strict'

const Model = use('Model')
const Drive = use('Drive')
const Event = use('Event')
const Cache = use('Cache')

class Object extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')

    this.addHook('beforeDelete', async (modelInstance) => {
      // if this is a file, delete the file in the drive
      if (modelInstance.storage_file && modelInstance.kind === 'file' && await modelInstance.exists()) {
        await Drive.delete(modelInstance.previewPath())
        return Drive.delete(`${modelInstance.drivePath}/${modelInstance.storage_file}`)
      }

      // if this is a folder, delete all children recursively
      if (modelInstance.kind === 'folder') {
        let children = await modelInstance.children().fetch()
        for (let child of children.rows) {
          await child.delete()
        }
      }
    })
  }

  static get incrementing () {
    return false
  }

  static get table () {
    return 'modules_files_objects'
  }

  static get dates () {
    return super.dates.concat(['modified_at'])
  }

  get drivePath () {
    return 'files'
  }

  owner () {
    return this.belongsTo('App/Models/User', 'owner_id')
  }

  team () {
    return this.belongsTo('App/Models/Modules/Files/Team', 'team_id')
  }

  parent () {
    return this.belongsTo('App/Models/Modules/Files/Object', 'parent_id')
  }

  children () {
    return this.hasMany('App/Models/Modules/Files/Object', 'id', 'parent_id')
  }

  stargazers () {
    return this.belongsToMany('App/Models/User').pivotTable('modules_files_objects_stargazers')
  }

  previewPath () {
    return `files/preview/${this.id}.jpg`
  }

  async getPreviewExists () {
    const cacheKey = `modules-files-preview/${this.id}`

    return Cache.tags(['modules-files-object']).remember(cacheKey, 5, async () => {
      return Drive.exists(this.previewPath())
    })
  }

  async exists () {
    return Drive.exists(`${this.drivePath}/${this.storage_file}`)
  }

  async trackDownload () {
    Event.fire('stats::modules-files-object::download', {
      entity_id: this.id
    })
  }
}

module.exports = Object
