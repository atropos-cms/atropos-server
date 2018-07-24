'use strict'

const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | App Url
  |--------------------------------------------------------------------------
  |
  | App url is the url under which the server application is accessible.
  | Make sure to update this in the .env file.
  |
  */
  url: Env.get('APP_URL'),

  /*
  |--------------------------------------------------------------------------
  | Frontend Url
  |--------------------------------------------------------------------------
  |
  | The Frontend url points to the domain where atropos-client can be reached.
  | This url will be used when generating emails that point to the application.
  | Make sure to update this in the .env file.
  |
  */
  frontendUrl: Env.get('FRONTEND_URL'),

  /*
  |--------------------------------------------------------------------------
  | Mail sender address
  |--------------------------------------------------------------------------
  |
  | This email address will be used when sending emails.
  |
  */
  mailSenderAddress: Env.get('MAIL_SENDER_ADDRESS', 'atropos@local'),

  /*
  |--------------------------------------------------------------------------
  | Api
  |--------------------------------------------------------------------------
  |
  | This section lets you specify the current api version and
  | the url under which the api can be reached.
  |
  */
  api: {
    backend: {
      version: 'v1',
      url: `${Env.get('APP_URL')}/backend/v1`
    },
    public: {
      version: 'v1',
      url: `${Env.get('APP_URL')}/public/v1`
    }
  }

}
