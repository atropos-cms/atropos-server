'use strict'

const path = require('path')

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/framework/providers/ViewProvider',
  '@adonisjs/lucid/providers/LucidProvider',
  '@adonisjs/lucid-slugify/providers/SlugifyProvider',
  '@adonisjs/auth/providers/AuthProvider',
  '@adonisjs/antl/providers/AntlProvider',
  '@adonisjs/bodyparser/providers/BodyParserProvider',
  '@adonisjs/cors/providers/CorsProvider',
  '@adonisjs/validator/providers/ValidatorProvider',
  '@adonisjs/drive/providers/DriveProvider',
  '@adonisjs/redis/providers/RedisProvider',
  '@adonisjs/mail/providers/MailProvider',
  '@adonisjs/websocket/providers/WsProvider',
  '@adonisjs/http-logger/providers/LoggerProvider',
  '@adonisjs/persona/providers/PersonaProvider',
  'adonis-bumblebee/providers/BumblebeeProvider',
  'adonis-cache/providers/CacheProvider',
  'adonis-scheduler/providers/SchedulerProvider',
  'adonis-kue/providers/KueProvider',
  'adonis-throttle-requests/providers/ThrottleRequestsProvider',
  path.join(__dirname, '..', 'providers', 'AppProvider'),
  path.join(__dirname, '..', 'providers', 'SentryProvider'),
  path.join(__dirname, '..', 'providers', 'TestingProvider')
]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider',
  '@adonisjs/vow/providers/VowProvider',
  'adonis-cache/providers/CommandsProvider',
  'adonis-kue/providers/CommandsProvider',
  'adonis-scheduler/providers/CommandsProvider'
]

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {
  Cache: 'Adonis/Addons/Cache',
  Scheduler: 'Adonis/Addons/Scheduler'
}

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = [
  'App/Commands/AdminCreate',
  'App/Commands/Install',
  'App/Commands/MediaRegenerate'
]

/*
|--------------------------------------------------------------------------
| Jobs
|--------------------------------------------------------------------------
|
| Here you register the available jobs for the kue package
|
*/
const jobs = [
  'App/Jobs/Auth/NotifyAccountCreated',
  'App/Jobs/Auth/PasswordChanged',
  'App/Jobs/Auth/PasswordReset',
  'App/Jobs/Auth/PasswordResetFailed',
  'App/Jobs/Auth/VerifyEmail',
  'App/Jobs/Modules/Mails/SendMailToContact',
  'App/Jobs/Modules/Mails/SendMailToUser',
  'App/Jobs/Modules/Media/Thumbnails',
  'App/Jobs/Modules/Media/Exif',
  'App/Jobs/Modules/Files/Preview',
  'App/Jobs/Modules/Files/CompressFolder'
]

module.exports = { providers, aceProviders, aliases, commands, jobs }
