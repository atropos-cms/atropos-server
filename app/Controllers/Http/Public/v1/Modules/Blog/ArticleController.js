'use strict'

const moment = require('moment')
const _ = require('lodash')
const Article = use('App/Models/Modules/Blog/Article')
const ArticleTransformer = use('App/Transformers/Public/v1/Modules/Blog/ArticleTransformer')

class ArticleController {
  async index ({transform}) {
    let articles = await Article.query()
      .where('published_at', '<=', Article.formatDates(null, moment()))
      .with('categories')
      .orderBy('published_at', 'desc')
      .fetch()

    // Custom order for event dates
    articles = _.orderBy(articles.rows, article => {
      // If there is an event date, sort by this
      if (article.event_at) {
        return article.event_at
      }

      // otherwise sort by publication date
      return article.published_at
    }, 'desc')

    return transform.collection(articles, ArticleTransformer)
  }

  async show ({params, transform}) {
    let article = Article.query()
      .where('published_at', '<=', Article.formatDates(null, moment()))
      .where('id', params.id)
      .orWhere('slug', params.id)
      .with('categories').first()

    return transform.include('content').item(article, ArticleTransformer)
  }
}

module.exports = ArticleController
