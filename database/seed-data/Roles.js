'use strict'

module.exports = [
  {
    name: 'Guest',
    permissions: [
      'login',
      'events'
    ],
    users: [
      'r2d2@starwars.com',
      'chewbacca@starwars.com'
    ]
  },
  {
    name: 'Users',
    permissions: [
      'login',
      'profile',
      'events',
      'modules-mails-send',
      'modules-media-browser',
      'modules-files'
    ],
    users: [
      'luke_skywalker@starwars.com',
      'leia_organa@starwars.com',
      'obiwan_kenobi@starwars.com'
    ]
  },
  {
    name: 'Administrators',
    permissions: [
      'login',
      'profile',
      'events',
      'modules-blog-articles',
      'modules-blog-categories',
      'modules-content-blocks',
      'modules-content-galleries',
      'modules-files-objects',
      'modules-files-teams',
      'modules-media-browser',
      'modules-media-files',
      'modules-mails-lists',
      'modules-mails-send',
      'administration-settings',
      'administration-users',
      'administration-roles'
    ],
    users: [
      'darth_vader@starwars.com',
      'yoda@starwars.com'
    ]
  }
]
