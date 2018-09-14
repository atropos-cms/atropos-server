'use strict'

const Article = use('App/Models/Modules/Blog/Article')
const jsondiffpatch = require('jsondiffpatch')

class VersionController {
  async index ({ params }) {
    let article = await Article.findOrFail(params.article)
    return article.versions().fetch()
  }

  async show ({ params }) {
    return Article.findOrFail(params.article).versions().findOrFail(params.id).fetch()
  }

  // restore
  async update ({ params }) {
    let article = await Article.findOrFail(params.article)
    let articleData = { ...article.toJSON() }

    let versions = await article.versions().fetch()

    versions.toJSON()
      .filter(v => v.id >= Number(params.id))
      .reverse()
      .forEach(version => {
        console.log(version.id)
        articleData = jsondiffpatch.unpatch(articleData, JSON.parse(version.diff))
      })

    await article.merge(articleData)
    await article.save()

    return article
  }
}

module.exports = VersionController
