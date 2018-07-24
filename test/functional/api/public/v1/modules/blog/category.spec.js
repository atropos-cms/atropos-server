'use strict'

const { test, trait } = use('Test/Suite')('Api/Public/v1/Modules/Blog/Category')
const Category = use('App/Models/Modules/Blog/Category')

trait('Test/Helpers')
trait('Test/ApiClient')
trait('DatabaseTransactions')

test('get list of categories', async ({ client, helpers }) => {
  let category = await Category.create({
    title: 'Cat-1'
  })

  const response = await client.get('/public/v1/modules/blog/categories').end()

  response.assertStatus(200)
  response.assertJSON([{
    id: category.id,
    title: 'Cat-1'
  }])
})

test('get an category by id', async ({ client, helpers }) => {
  let category = await Category.create({
    title: 'Cat-1'
  })

  const response = await client.get(`/public/v1/modules/blog/categories/${category.id}`).end()

  response.assertStatus(200)
  response.assertJSON({
    id: category.id,
    title: 'Cat-1'
  })
})

test('modification methods are not available on public api', async ({ client, helpers }) => {
  const responseCreate = await client.post(`/public/v1/modules/blog/categories`).send({}).end()
  responseCreate.assertStatus(404)

  let category = await Category.create({
    title: 'Cat-1'
  })

  const responseUpdate = await client.put(`/public/v1/modules/blog/categories/${category.id}`).send({}).end()
  responseUpdate.assertStatus(404)

  const responseDelete = await client.delete(`/public/v1/modules/blog/categories/${category.id}`).send({}).end()
  responseDelete.assertStatus(404)
})
