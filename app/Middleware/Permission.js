'use strict'

class Permission {
  async handle ({ request, auth }, next, params) {
    let permissions = await auth.user.getPermissions()

    for (let permission of params) {
      if (!permissions.includes(permission)) {
        throw new Error(`E_PERMISSION_DENIED: You need permission '${permission}' to perform this action.`)
      }
    }

    await next()
  }

  async wsHandle ({ request, auth }, next, params) {
    let permissions = await auth.user.getPermissions()

    for (let permission of params) {
      if (!permissions.includes(permission)) {
        throw new Error(`E_PERMISSION_DENIED: You need permission '${permission}' to perform this action.`)
      }
    }

    await next()
  }
}

module.exports = Permission
