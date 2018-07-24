'use strict'

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

const Route = use('Route')

// Routes without caching
Route.group(() => {
  /*
  **  --- MODULES
  **/

  // Mail
  Route.post('modules/mails/send', 'Modules/Mails/SendController.send')
})
  .prefix('public/v1')
  .namespace('Public/v1')

// Routes with caching
Route.group(() => {
  /*
  **  --- MODULES
  **/

  // Blog
  Route.resource('modules/blog/articles', 'Modules/Blog/ArticleController').only(['index', 'show'])
  Route.resource('modules/blog/categories', 'Modules/Blog/CategoryController').only(['index', 'show'])

  // Content
  Route.resource('modules/content/blocks', 'Modules/Content/BlockController').only(['index', 'show'])
  Route.resource('modules/content/galleries', 'Modules/Content/GalleryController').only(['index', 'show'])
})
  .prefix('public/v1')
  .namespace('Public/v1')
  .middleware(['caching'])
