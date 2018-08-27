'use strict'

/*
|--------------------------------------------------------------------------
| Backend Routes
|--------------------------------------------------------------------------
*/

const Route = use('Route')

/*
| Unauthenticated Backend Routes
*/
Route.group('backend-v1--no-auth', () => {
  Route.post('/auth/login', 'Auth/AuthController.login')
  Route.post('/auth/refresh', 'Auth/AuthController.refresh')
  Route.post('/auth/password-reset', 'Auth/PasswordResetController.send')
  Route.put('/auth/password-reset', 'Auth/PasswordResetController.reset')

  Route.get('modules/files/download/:token', 'Modules/Files/DownloadController.download')
})
  .prefix('backend/v1')
  .namespace('Backend/v1')
  .middleware('throttle:30,3')

/*
| Authenticated Backend Routes
*/
Route.group('backend-v1--auth', () => {
  Route.post('/auth/logout', 'Auth/AuthController.logout')

  Route.get('/me', 'Auth/AuthController.get').middleware('permission:login')
  Route.put('/me', 'Auth/AuthController.update').middleware('permission:profile').validator('UpdateProfile')
  Route.post('/me/send-email-verification', 'Auth/AuthController.sendEmailVerification').middleware('permission:profile')
  Route.post('/me/verify-email', 'Auth/AuthController.verifyEmail').middleware('permission:profile')

  Route.get('administration/settings', 'Administration/SettingController.index').middleware('permission:login')
  Route.put('administration/settings', 'Administration/SettingController.update').middleware('permission:administration-settings')
  Route.delete('administration/settings/clear-cache', 'Administration/SettingController.clearCache').middleware('permission:administration-settings')

  Route.resource('administration/events', 'Administration/EventController').middleware('permission:events')

  Route.resource('administration/users', 'Administration/UserController').only(['index', 'show']).middleware('permission:login')
  Route.resource('administration/users', 'Administration/UserController').except(['index', 'show']).middleware('permission:administration-users')

  Route.resource('administration/roles', 'Administration/RoleController').only(['index', 'show']).middleware('permission:login')
  Route.resource('administration/roles', 'Administration/RoleController').except(['index', 'show']).middleware('permission:administration-roles')

  /*
   *  --- MODULES
   */

  // Blog
  Route.resource('modules/blog/articles', 'Modules/Blog/ArticleController').middleware('permission:modules-blog-articles')
  // Route.resource('modules/blog/articles/:article/versions', 'Modules/Blog/Article/VersionController')
  Route.resource('modules/blog/categories', 'Modules/Blog/CategoryController').only(['index', 'show']).middleware('permissionSome:modules-blog-articles,modules-blog-categories')
  Route.resource('modules/blog/categories', 'Modules/Blog/CategoryController').except(['index', 'show']).middleware('permission:modules-blog-categories')

  // Content
  Route.resource('modules/content/blocks', 'Modules/Content/BlockController').middleware('permission:modules-content-blocks')
  Route.resource('modules/content/galleries', 'Modules/Content/GalleryController').middleware('permission:modules-content-galleries')

  // Media
  Route.resource('modules/media/files', 'Modules/Media/FileController').only(['index', 'show', 'store']).middleware('permission:modules-media-browser')
  Route.resource('modules/media/files', 'Modules/Media/FileController').except(['index', 'show', 'store']).middleware('permission:modules-media-files')
  Route.post('modules/media/upload/:token', 'Modules/Media/UploadController.upload').middleware('permission:modules-media-browser')

  // Files
  Route.resource('modules/files/teams', 'Modules/Files/TeamController').only(['index', 'show']).middleware(['permissionSome:modules-files-objects,modules-files-teams'])
  Route.resource('modules/files/teams', 'Modules/Files/TeamController').except(['index', 'show']).middleware(['permission:modules-files-teams'])

  Route.resource('modules/files/:team/objects', 'Modules/Files/ObjectController').only(['index', 'show']).middleware(['permission:modules-files-objects', 'modulesFilesTeamsPermission:read'])
  Route.post('modules/files/:team/objects/:id/star', 'Modules/Files/ObjectController.star').middleware(['permission:modules-files-objects', 'modulesFilesTeamsPermission:read'])
  Route.delete('modules/files/:team/objects/:id/star', 'Modules/Files/ObjectController.unstar').middleware(['permission:modules-files-objects', 'modulesFilesTeamsPermission:read'])
  Route.post('modules/files/:team/objects/:id/download', 'Modules/Files/DownloadController.request').middleware(['permission:modules-files-objects', 'modulesFilesTeamsPermission:read'])
  Route.get('modules/files/download/:token/status', 'Modules/Files/DownloadController.status').middleware(['permission:modules-files-objects', 'throttle:200'])

  Route.resource('modules/files/:team/objects', 'Modules/Files/ObjectController').except(['index', 'show']).middleware(['permission:modules-files-objects', 'modulesFilesTeamsPermission:write'])
  Route.post('modules/files/upload/:token', 'Modules/Files/UploadController.upload').as('modules-files-upload').middleware(['permission:modules-files-objects'])

  // Mails
  Route.resource('modules/mails/lists', 'Modules/Mails/ListController').only(['index', 'show']).middleware('permissionSome:modules-mails-send,modules-mails-lists')
  Route.resource('modules/mails/lists', 'Modules/Mails/ListController').except(['index', 'show']).middleware('permission:modules-mails-lists')
  Route.post('modules/mails/send', 'Modules/Mails/SendController.send').as('modules-mails-send').middleware('permission:modules-mails-send')
})
  .prefix('backend/v1')
  .namespace('Backend/v1')
  .middleware(['auth'])
  .middleware('throttle:500,1')
