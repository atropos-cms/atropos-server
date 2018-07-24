'use strict'

const { test, trait } = use('Test/Suite')('Api/Public/v1/Modules/Content/Gallery')
const Gallery = use('App/Models/Modules/Content/Gallery')
const File = use('App/Models/Modules/Media/File')

trait('Test/Helpers')
trait('Test/ApiClient')
trait('DatabaseTransactions')

test('list of galleries only contains galleries with images', async ({ client, helpers }) => {
  await Gallery.create({
    title: 'Atropos first gallery',
    description: 'Content post content',
    published: true
  })

  const response = await client.get('/public/v1/modules/content/galleries').end()

  response.assertStatus(200)
  response.assertJSON([])
})

test('get list of galleries with images', async ({ client, helpers }) => {
  let gallery = await Gallery.create({
    title: 'Atropos first gallery',
    description: 'Content post content',
    published: true
  })

  let file = await File.create({})
  await gallery.images().attach([file.id])

  const response = await client.get('/public/v1/modules/content/galleries').end()

  response.assertStatus(200)
  response.assertJSON([{
    id: gallery.id,
    title: 'Atropos first gallery',
    slug: 'atropos-first-gallery',
    description: 'Content post content',
    author: null,
    cover: {
      id: file.id,
      name: null,
      description: null,
      size: null,
      mime_type: null,
      file_extension: null,
      sha256_checksum: null,
      original_filename: null,
      download_url: file.getDownloadUrl(),
      r: { '300': null, '600': null, '1200': null, '2400': null },
      s: { '50': null, '300': null, '600': null },
      created_at: file.created_at,
      updated_at: file.updated_at
    },
    imageCount: 1,
    order: null,
    created_at: gallery.created_at,
    updated_at: gallery.updated_at
  }])
})

test('get an gallery by id', async ({ client, helpers }) => {
  let gallery = await Gallery.create({
    title: 'Atropos detail gallery',
    description: 'Content post content',
    published: true
  })

  const response = await client.get(`/public/v1/modules/content/galleries/${gallery.id}`).end()

  response.assertStatus(200)
  response.assertJSON({
    id: gallery.id,
    title: 'Atropos detail gallery',
    slug: 'atropos-detail-gallery',
    description: 'Content post content',
    author: null,
    cover: null,
    images: [],
    imageCount: 0,
    order: null,
    created_at: gallery.created_at,
    updated_at: gallery.updated_at
  })
})

test('a gallery can have an author', async ({ client, helpers }) => {
  let gallery = await Gallery.create({
    title: 'Atropos detail gallery',
    description: 'Content post content',
    published: true
  })
  await gallery.author().associate(await helpers.user())

  const response = await client.get(`/public/v1/modules/content/galleries/${gallery.id}`).end()

  response.assertStatus(200)
  response.assertJSON({
    id: gallery.id,
    title: 'Atropos detail gallery',
    slug: 'atropos-detail-gallery',
    description: 'Content post content',
    author: 'Firstname Lastname',
    cover: null,
    images: [],
    imageCount: 0,
    order: null,
    created_at: gallery.created_at,
    updated_at: gallery.updated_at
  })
})

test('galleries with published not set are not listed', async ({ client, helpers }) => {
  let gallery = await Gallery.create({
    title: 'Atropos published gallery',
    description: 'Content post content',
    published: false
  })

  const responseList = await client.get(`/public/v1/modules/content/galleries`).end()

  responseList.assertStatus(200)
  responseList.assertJSON([])

  const responseDetail = await client.get(`/public/v1/modules/content/galleries/${gallery.id}`).end()

  responseDetail.assertStatus(204)
  responseDetail.assertJSON({})
})

test('modification methods are not available on public api', async ({ client, helpers }) => {
  const responseCreate = await client.post(`/public/v1/modules/content/galleries`).send({}).end()
  responseCreate.assertStatus(404)

  let gallery = await Gallery.create({
    title: 'Atropos published gallery',
    description: 'Content post content',
    published: true
  })

  const responseUpdate = await client.put(`/public/v1/modules/content/galleries/${gallery.id}`).send({}).end()
  responseUpdate.assertStatus(404)

  const responseDelete = await client.delete(`/public/v1/modules/content/galleries/${gallery.id}`).send({}).end()
  responseDelete.assertStatus(404)
})
