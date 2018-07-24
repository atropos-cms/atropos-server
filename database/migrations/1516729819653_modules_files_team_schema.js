'use strict'

const Schema = use('Schema')

class CreateModulesFilesTeamSchema extends Schema {
  up () {
    this.create('modules_files_teams', (table) => {
      table.uuid('id').primary()
      table.string('name').nullable()
      table.timestamps()
    })

    this.create('modules_files_teams_users', (table) => {
      table.increments()
      table.uuid('team_id')
      table.uuid('user_id')
      table.boolean('manage').default(false)
    })

    this.create('modules_files_teams_roles', (table) => {
      table.increments()
      table.uuid('team_id')
      table.uuid('role_id')
      table.boolean('manage').default(false)
    })
  }

  down () {
    this.drop('modules_files_teams')
    this.drop('modules_files_teams_users')
    this.drop('modules_files_teams_roles')
  }
}

module.exports = CreateModulesFilesTeamSchema
