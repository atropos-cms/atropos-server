'use strict'

const { test, trait } = use('Test/Suite')('Api/Backend/v1/Auth/Auth')

trait('Test/Helpers')
trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('a user can authenticate', async ({ client, helpers }) => {
  let user = await helpers.user()

  const response = await client.post('/backend/v1/auth/login').send({
    uid: user.email,
    password: 'secret'
  }).end()

  response.assertStatus(200)
  response.assertJSONSubset({
    token: {
      type: 'bearer'
    }
  })

  // the returned token should be valid to request the me object
  const responseMe = await client.get('/backend/v1/me').header('Authorization', `Bearer ${response.body.token.token}`).end()

  responseMe.assertJSONSubset({
    id: user.id,

    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    account_status: user.account_status,

    street: user.street,
    postal_code: user.postal_code,
    city: user.city,
    country: user.country
  })
})

test('a user must be activated to login', async ({ client, helpers }) => {
  let user = await helpers.userWithoutRoles()
  user.activated = false
  user.save()

  const response = await client.post('/backend/v1/auth/login').send({
    uid: user.email,
    password: 'secret'
  }).end()

  response.assertStatus(401)
  response.assertError({
    error: {
      message: 'E_ACCOUNT_NOT_ACTIVATED: Your account has not been activated yet.'
    }
  })
})

test('a user needs `login` permission to get user object', async ({ client, helpers }) => {
  let user = await helpers.userWithoutRoles()

  const response = await client.get('/backend/v1/me').loginVia(user, 'jwt').end()

  response.assertStatus(500)
  response.assertError({
    error: {
      message: 'E_PERMISSION_DENIED: You need permission \'login\' to perform this action.'
    }
  })
})

test('a user can update their profile', async ({ client, helpers }) => {
  let user = await helpers.admin()

  const response = await client.put('/backend/v1/me').loginVia(user, 'jwt').send({
    first_name: user.first_name,
    last_name: user.last_name,
    email: 'new@local.com'
  }).end()

  response.assertStatus(200)
  response.assertJSONSubset({
    id: user.id,

    first_name: user.first_name,
    last_name: user.last_name,
    email: 'new@local.com'
  })
})

test('permission `profile` is required to update the profile', async ({ client, helpers }) => {
  let user = await helpers.user()

  const response = await client.put('/backend/v1/me').loginVia(user, 'jwt').send({
    first_name: user.first_name,
    last_name: user.last_name,
    email: 'new@local.com'
  }).end()

  response.assertStatus(500)
  response.assertError({
    error: {
      message: 'E_PERMISSION_DENIED: You need permission \'profile\' to perform this action.'
    }
  })
})
