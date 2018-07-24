'use strict'

const Role = use('App/Models/Role')
const Setting = use('App/Models/Setting')
const Permission = use('App/Models/Permission')
const User = use('App/Models/User')

const permissions = {
  user: [
    'login',
    'events'
  ],
  admin: [
    'login',
    'profile',
    'events',
    'modules-blog-articles',
    'modules-blog-categories',
    'modules-content-blocks',
    'modules-content-galleries',
    'modules-files-objects',
    'modules-files-teams',
    'modules-media-files',
    'modules-mails-lists',
    'modules-mails-send',
    'administration-settings',
    'administration-users',
    'administration-roles'
  ]
}

module.exports = {
  async role (name) {
    let roleEntity = await Role.create({
      name: name
    })

    for (let p of permissions[name]) {
      const permission = await Permission.findOrCreate({ name: p })
      await roleEntity.permissions().save(permission)
    }

    return roleEntity
  },

  async userWithoutRoles () {
    return User.create({
      email: 'user@local',
      first_name: 'Firstname',
      last_name: 'Lastname',
      street: '',
      postal_code: '',
      city: '',
      country: '',
      password: 'secret',
      account_status: 'active',
      activated: true
    })
  },

  async user () {
    let user = await this.userWithoutRoles()
    let userRole = await this.role('user')

    await userRole.members().save(user)
    return user
  },

  async admin () {
    let user = await this.userWithoutRoles()
    let userRole = await this.role('admin')

    await userRole.members().save(user)
    return user
  },

  async setting () {
    return Setting.create({
      developer_mode: false,
      locale: 'en'
    })
  }
}
