'use strict'

/*
|--------------------------------------------------------------------------
| Common Routes
|--------------------------------------------------------------------------
*/
const Route = use('Route')

// Meta
Route.group(() => {
  Route.get('/', () => ({ title: 'Atropos Api Endpoint' }))
  Route.get('public/v1', ({ response }) => response.redirect('/public/v1/meta'))
  Route.get('backend/v1', ({ response }) => response.redirect('/backend/v1/meta'))
  Route.get('backend/v1/meta', 'MetaController.index')
  Route.get('public/v1/meta', 'MetaController.index')
})
  .namespace('Common/v1')
  .middleware(['throttle:200'])

// Default url
Route.group(() => {
  // Media Backend
  Route.get('backend/v1/modules/media/files/:id/download', 'Modules/Media/DownloadController.download')
  Route.get('backend/v1/modules/media/files/:type/:size/:id/download', 'Modules/Media/DownloadController.download')
  // Media Public
  Route.get('public/v1/modules/media/files/:id/download', 'Modules/Media/DownloadController.download')
  Route.get('public/v1/modules/media/files/:type/:size/:id/download', 'Modules/Media/DownloadController.download')
})
  .namespace('Common/v1')
  .middleware(['throttle:600'])
