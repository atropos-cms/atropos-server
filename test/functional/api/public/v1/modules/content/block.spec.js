'use strict'

const { test, trait } = use('Test/Suite')('Api/Public/v1/Modules/Content/Block')
const Block = use('App/Models/Modules/Content/Block')

trait('Test/Helpers')
trait('Test/ApiClient')
trait('DatabaseTransactions')

test('get list of blocks', async ({ client, helpers }) => {
  let block = await Block.create({
    title: 'Atropos first block',
    content: 'Content post content',
    published: true
  })

  const response = await client.get('/public/v1/modules/content/blocks').end()

  response.assertStatus(200)
  response.assertJSON([{
    id: block.id,
    title: 'Atropos first block',
    slug: 'atropos-first-block',
    content: 'Content post content',
    author: null,
    created_at: block.created_at,
    updated_at: block.updated_at
  }])
})

test('get an block by id', async ({ client, helpers }) => {
  let block = await Block.create({
    title: 'Atropos detail block',
    content: 'Content post content',
    published: true
  })

  const response = await client.get(`/public/v1/modules/content/blocks/${block.id}`).end()

  response.assertStatus(200)
  response.assertJSON({
    id: block.id,
    title: 'Atropos detail block',
    slug: 'atropos-detail-block',
    content: 'Content post content',
    author: null,
    created_at: block.created_at,
    updated_at: block.updated_at
  })
})

test('a block can have an author', async ({ client, helpers }) => {
  let block = await Block.create({
    title: 'Atropos detail block',
    content: 'Content post content',
    published: true
  })
  await block.author().associate(await helpers.user())

  const response = await client.get(`/public/v1/modules/content/blocks/${block.id}`).end()

  response.assertStatus(200)
  response.assertJSON({
    id: block.id,
    title: 'Atropos detail block',
    slug: 'atropos-detail-block',
    content: 'Content post content',
    author: 'Firstname Lastname',
    created_at: block.created_at,
    updated_at: block.updated_at
  })
})

test('blocks with published not set are not listed', async ({ client, helpers }) => {
  let block = await Block.create({
    title: 'Atropos published block',
    content: 'Content post content',
    published: false
  })

  const responseList = await client.get(`/public/v1/modules/content/blocks`).end()

  responseList.assertStatus(200)
  responseList.assertJSON([])

  const responseDetail = await client.get(`/public/v1/modules/content/blocks/${block.id}`).end()

  responseDetail.assertStatus(204)
  responseDetail.assertJSON({})
})

test('modification methods are not available on public api', async ({ client, helpers }) => {
  const responseCreate = await client.post(`/public/v1/modules/content/blocks`).send({}).end()
  responseCreate.assertStatus(404)

  let block = await Block.create({
    title: 'Atropos published block',
    content: 'Content post content',
    published: true
  })

  const responseUpdate = await client.put(`/public/v1/modules/content/blocks/${block.id}`).send({}).end()
  responseUpdate.assertStatus(404)

  const responseDelete = await client.delete(`/public/v1/modules/content/blocks/${block.id}`).send({}).end()
  responseDelete.assertStatus(404)
})
