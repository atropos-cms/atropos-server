'use strict'

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Hashing Algorithm
  |--------------------------------------------------------------------------
  */
  driver: 'argon',

  /*
  |--------------------------------------------------------------------------
  | Bcrypt
  |--------------------------------------------------------------------------
  */
  bcrypt: {
    rounds: 10
  },

  /*
  |--------------------------------------------------------------------------
  | Argon2
  |--------------------------------------------------------------------------
  */
  argon: {
    type: 1
  }
}
