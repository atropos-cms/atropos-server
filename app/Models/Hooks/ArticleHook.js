'use strict'

const Database = use('Database')
const jsondiffpatch = require('jsondiffpatch')

const ArticleHook = module.exports = {}

/**
 * Save a new version.
 *
 * @method
 *
 * @param  {Object} articleInstance
 *
 * @return {void}
 */
ArticleHook.createVersion = async (modelInstance) => {
  const delta = jsondiffpatch.diff(modelInstance.$originalAttributes, modelInstance.$attributes)

  const filtered = _filterDiffProperties(delta)

  if (!Object.keys(filtered).length) return

  await Database
    .table('modules_blog_articles_versions')
    .insert({
      diff: JSON.stringify(filtered),
      article_id: modelInstance.id
    })
}

const _filterDiffProperties = function (delta) {
  const ignoredKeys = ['created_at', 'updated_at', 'published_at']

  const filtered = Object.keys(delta)
    .filter(key => !ignoredKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = delta[key]
      return obj
    }, {})

  return filtered
}
