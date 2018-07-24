'use strict'

/*
|--------------------------------------------------------------------------
| Macros
|--------------------------------------------------------------------------
*/
const RouteGroup = require('@adonisjs/framework/src/Route/Group')

RouteGroup.macro('namespace', function (namespace) {
  namespace = `${namespace.replace(/^\/|\/$/g, '')}/`

  this._routes.forEach((route) => {
    if (typeof (route.handler) !== 'string') return

    route.handler = namespace + route.handler
  })

  return this
})

/*
|--------------------------------------------------------------------------
| Redefine the internal method so we do not have to call .apiOnly() on each resource route.
| This might break in a future update..
|--------------------------------------------------------------------------
*/
const RouteResource = require('@adonisjs/framework/src/Route/Resource')
RouteResource.prototype._addBasicRoutes = function () {
  this._addRoute('index', this._resourceUrl)
  this._addRoute('store', this._resourceUrl, ['POST'])
  this._addRoute('show', `${this._resourceUrl}/:id`)
  this._addRoute('update', `${this._resourceUrl}/:id`, ['PUT', 'PATCH'])
  this._addRoute('destroy', `${this._resourceUrl}/:id`, ['DELETE'])
}

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

require('./routes/backend/v1')
require('./routes/public/v1')
require('./routes/common/v1')
