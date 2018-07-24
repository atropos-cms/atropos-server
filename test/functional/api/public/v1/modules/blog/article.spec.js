'use strict'

const { test, trait } = use('Test/Suite')('Api/Public/v1/Modules/Blog/Article')
const Article = use('App/Models/Modules/Blog/Article')
const moment = require('moment')

trait('Test/Helpers')
trait('Test/ApiClient')
trait('DatabaseTransactions')

test('get list of articles', async ({ client, helpers }) => {
  let article = await Article.create({
    title: 'Atropos first article',
    content: 'Blog post content',
    published_at: moment()
  })

  const response = await client.get('/public/v1/modules/blog/articles').end()

  response.assertStatus(200)
  response.assertJSON([{
    id: article.id,
    title: 'Atropos first article',
    slug: 'atropos-first-article',
    summary: 'Blog post content',
    attachments: [],
    author: null,
    categories: [],
    cover: null,
    type: null,
    event_at: null,
    created_at: article.created_at,
    updated_at: article.updated_at,
    published_at: article.published_at
  }])
})

test('get an article by id', async ({ client, helpers }) => {
  let article = await Article.create({
    title: 'Atropos detail article',
    content: 'Blog post content',
    published_at: moment()
  })

  const response = await client.get(`/public/v1/modules/blog/articles/${article.id}`).end()

  response.assertStatus(200)
  response.assertJSON({
    id: article.id,
    title: 'Atropos detail article',
    slug: 'atropos-detail-article',
    summary: 'Blog post content',
    content: 'Blog post content',
    attachments: [],
    author: null,
    categories: [],
    cover: null,
    type: null,
    event_at: null,
    created_at: article.created_at,
    updated_at: article.updated_at,
    published_at: article.published_at
  })
})

test('an Article can have an author', async ({ client, helpers }) => {
  let article = await Article.create({
    title: 'Atropos detail article',
    content: 'Blog post content',
    published_at: moment()
  })
  await article.author().associate(await helpers.user())

  const response = await client.get(`/public/v1/modules/blog/articles/${article.id}`).end()

  response.assertStatus(200)
  response.assertJSON({
    id: article.id,
    title: 'Atropos detail article',
    slug: 'atropos-detail-article',
    summary: 'Blog post content',
    content: 'Blog post content',
    attachments: [],
    author: 'Firstname Lastname',
    categories: [],
    cover: null,
    type: null,
    event_at: null,
    created_at: article.created_at,
    updated_at: article.updated_at,
    published_at: article.published_at
  })
})

test('get article list with content included', async ({ client, helpers }) => {
  let article = await Article.create({
    title: 'Atropos detail article with content',
    content: 'Blog post content',
    published_at: moment()
  })

  const response = await client.get(`/public/v1/modules/blog/articles?include=content`).end()

  response.assertStatus(200)
  response.assertJSON([{
    id: article.id,
    title: 'Atropos detail article with content',
    slug: 'atropos-detail-article-with-content',
    summary: 'Blog post content',
    content: 'Blog post content',
    attachments: [],
    author: null,
    categories: [],
    cover: null,
    type: null,
    event_at: null,
    created_at: article.created_at,
    updated_at: article.updated_at,
    published_at: article.published_at
  }])
})

test('get an article with long content', async ({ client, helpers }) => {
  let article = await Article.create({
    title: 'Atropos detail article with long content',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non pellentesque ante. Aenean scelerisque risus elit, eget imperdiet massa vehicula ut. Mauris blandit quis nulla vitae pellentesque. Nunc vitae nisl tempus, convallis sapien sit amet, elementum enim. Praesent placerat nulla at leo volutpat, eu blandit ligula tempor. In tempor ex a risus placerat, sed pulvinar sem mollis. Vivamus et massa a massa consequat aliquam vel ut est. Vivamus dignissim nulla leo, quis lacinia tortor dapibus id. Maecenas a diam pretium, vulputate massa eget, luctus magna',
    published_at: moment()
  })

  const response = await client.get(`/public/v1/modules/blog/articles/${article.id}?include=content`).end()

  response.assertStatus(200)
  response.assertJSON({
    id: article.id,
    title: 'Atropos detail article with long content',
    slug: 'atropos-detail-article-with-long-content',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non pellentesque ante. Aenean scelerisque risus elit, eget imperdiet massa vehicula ut. Mauris blandit quis nulla vitae pellentesque.…',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non pellentesque ante. Aenean scelerisque risus elit, eget imperdiet massa vehicula ut. Mauris blandit quis nulla vitae pellentesque. Nunc vitae nisl tempus, convallis sapien sit amet, elementum enim. Praesent placerat nulla at leo volutpat, eu blandit ligula tempor. In tempor ex a risus placerat, sed pulvinar sem mollis. Vivamus et massa a massa consequat aliquam vel ut est. Vivamus dignissim nulla leo, quis lacinia tortor dapibus id. Maecenas a diam pretium, vulputate massa eget, luctus magna',
    attachments: [],
    author: null,
    categories: [],
    cover: null,
    type: null,
    event_at: null,
    created_at: article.created_at,
    updated_at: article.updated_at,
    published_at: article.published_at
  })
})

test('articles with published_at in future are not listed', async ({ client, helpers }) => {
  let article = await Article.create({
    title: 'Atropos published article',
    content: 'Blog post content',
    published_at: moment().add(1, 'minute')
  })

  const responseList = await client.get(`/public/v1/modules/blog/articles`).end()

  responseList.assertStatus(200)
  responseList.assertJSON([])

  const responseDetail = await client.get(`/public/v1/modules/blog/articles/${article.id}`).end()

  responseDetail.assertStatus(204)
  responseDetail.assertJSON({})
})

test('modification methods are not available on public api', async ({ client, helpers }) => {
  const responseCreate = await client.post(`/public/v1/modules/blog/articles`).send({}).end()
  responseCreate.assertStatus(404)

  let article = await Article.create({
    title: 'Atropos published article',
    content: 'Blog post content',
    published_at: moment().add(1, 'minute')
  })

  const responseUpdate = await client.put(`/public/v1/modules/blog/articles/${article.id}`).send({}).end()
  responseUpdate.assertStatus(404)

  const responseDelete = await client.delete(`/public/v1/modules/blog/articles/${article.id}`).send({}).end()
  responseDelete.assertStatus(404)
})
