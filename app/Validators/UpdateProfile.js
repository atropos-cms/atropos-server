'use strict'

class UpdateProfile {
  get sanitizationRules () {
    return {
      first_name: 'strip_tags',
      last_name: 'strip_tags',
      street: 'strip_tags',
      city: 'strip_tags',
      postal_code: 'strip_tags',
      country: 'strip_tags'
    }
  }

  get rules () {
    if (this.ctx.request.all().hasOwnProperty('old_password')) {
      return {
        old_password: 'required',
        password: 'required|min:6',
        password_confirmation: 'required|same:password'
      }
    }

    const userId = this.ctx.auth.user.id
    return {
      email: `required|email|unique:users,email,id,${userId}`,
      first_name: 'required',
      last_name: 'required'
    }
  }
}

module.exports = UpdateProfile
