'use strict'

const Drive = use('Drive')
const Factory = use('Factory')
const Database = use('Database')
const faker = require('chance').Chance()

const SEED_FILES = false

class ModulesFilesObjectSeeder {
  async run () {
    await Drive.delete(`files`)
    console.log('Deleted all files in /files')

    const users = await Database.table('users')
    const teams = await Database.table('modules_files_teams')

    for (let team of teams) {
      await seedFiles(null, team)

      // seed folders
      const folders = await Factory
        .model('App/Models/Modules/Files/Object')
        .createMany(4)

      for (let folder of folders) {
        folder.merge({ kind: 'folder', mime_type: null, file_extension: null, size: null })
        await folder.save()
        await folder.owner().associate(faker.pickone(users))
        await folder.team().associate(team)
        await seedFiles(folder, team)
      }
    }

    console.log('Seeded Modules/Files/Object')
  }
}

const seedFiles = async (parent, team) => {
  if (!SEED_FILES) return

  const users = await Database.table('users')

  // seed files inside this folder
  const files = await Factory
    .model('App/Models/Modules/Files/Object')
    .createMany(6)

  for (let file of files) {
    if ((parent && parent.id)) {
      file.merge({ parent_id: parent.id })
      await file.save()
    }

    await file.owner().associate(faker.pickone(users))
    await file.team().associate(team)
  }
}

module.exports = ModulesFilesObjectSeeder
