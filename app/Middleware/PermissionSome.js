'use strict'

class PermissionSome {
  async handle ({ request, auth }, next, params) {
    let permissions = await auth.user.getPermissions()

    for (let permission of params) {
      if (permissions.includes(permission)) {
        return next()
      }
    }

    throw new Error(`E_PERMISSION_DENIED: You need permission at least one of these permissions '${params.join(', ')}' to perform this action.`)
  }

  async wsHandle ({ request, auth }, next, params) {
    let permissions = await auth.user.getPermissions()

    for (let permission of params) {
      if (permissions.includes(permission)) {
        return next()
      }
    }

    throw new Error(`E_PERMISSION_DENIED: You need permission at least one of these permissions '${params.join(', ')}' to perform this action.`)
  }
}

module.exports = PermissionSome
