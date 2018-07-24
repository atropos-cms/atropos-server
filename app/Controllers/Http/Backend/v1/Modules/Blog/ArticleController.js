'use strict'

const Event = use('Event')
const Article = use('App/Models/Modules/Blog/Article')
const ArticleTransformer = use('App/Transformers/Backend/v1/Modules/Blog/ArticleTransformer')

class ArticleController {
  async index ({transform}) {
    let articles = Article.query()
      .with('categories')
      .with('attachments')
      .orderBy('published_at', 'desc')
      .fetch()

    return transform.collection(articles, ArticleTransformer)
  }

  async show ({params, transform}) {
    let article = await Article.query()
      .where('id', params.id)
      .firstOrFail()

    return transform.include('content').item(article, ArticleTransformer)
  }

  async store ({request, auth, transform}) {
    let data = {
      // defaults
      type: 'text',

      // request
      ...request.only([
        'title',
        'type',
        'content',
        'published_at',
        'event_at',
        'author_id',
        'cover_id'
      ]),

      // override
      author_id: auth.user.id
    }

    const article = await Article.create(data)

    await article.loadMany(['categories', 'attachments'])

    Event.fire('event::modules-blog-article::new', {
      owner_id: auth.user.id,
      data: article
    })

    return transform.include('content').item(article, ArticleTransformer)
  }

  async update ({params, request, auth, transform}) {
    let article = await Article.query()
      .where('id', params.id)
      .firstOrFail()

    await article.merge(request.only([
      'title',
      'type',
      'content',
      'published_at',
      'event_at',
      'author_id',
      'cover_id'
    ]))

    let categories = request.only(['categories']).categories.map(c => c.id || c)
    await article.categories().detach()
    await article.categories().attach(categories)

    let attachments = request.only(['attachments']).attachments.map(a => a.id || a)
    await article.attachments().detach()
    await article.attachments().attach(attachments)

    await article.save()

    Event.fire('event::modules-blog-article::update', {
      owner_id: auth.user.id,
      data: article
    })

    await article.loadMany(['categories', 'attachments'])
    return transform.include('content').item(article, ArticleTransformer)
  }

  async destroy ({params}) {
    return Article.query()
      .where({id: params.id})
      .delete()
  }
}

module.exports = ArticleController
