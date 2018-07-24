'use strict'

const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | redis connection config
  |--------------------------------------------------------------------------
  |
  | Specify the name of the redis connection to be used.
  |
  */
  connection: Env.get('KUE_CONNECTION', 'local')
}
