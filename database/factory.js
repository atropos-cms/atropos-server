'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

const Factory = use('Factory')
const moment = use('moment')

Factory.blueprint('App/Models/Modules/Blog/Article', async (faker) => {
  return {
    title: faker.sentence({ words: 4 }),
    type: faker.pickone(['text', 'image']),
    content: faker.paragraph(),
    published_at: faker.bool() ? (faker.bool() ? moment().add(7, 'days').toDate() : moment().subtract(7, 'days').toDate()) : null,
    event_at: faker.bool() ? (faker.bool() ? moment().add(30, 'days').toDate() : moment().subtract(30, 'days').toDate()) : null
  }
})

Factory.blueprint('App/Models/Modules/Blog/Category', (faker) => {
  return {
    title: faker.capitalize(faker.word())
  }
})

Factory.blueprint('App/Models/Modules/Content/Block', (faker) => {
  return {
    title: faker.sentence({ words: 4 }),
    content: faker.paragraph(),
    published: faker.bool()
  }
})

Factory.blueprint('App/Models/Modules/Files/Team', (faker) => {
  return {
    name: faker.province({ full: true })
  }
})

Factory.blueprint('App/Models/Modules/Files/Object', (faker) => {
  return {
    kind: 'file',
    name: faker.province({ full: true }),
    mime_type: faker.pickone(['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'audio/mpeg']),
    description: faker.paragraph(),
    trashed: faker.bool({ likelihood: 30 }),
    original_filename: faker.province({ full: true }),
    file_extension: faker.pickone(['.jpg', '.png', '.pdf', '.docx', '.mp3']),
    sha256_checksum: faker.md5(),
    size: faker.integer({ min: 0, max: 82383854 }),
    status: 'ready'
  }
})

Factory.blueprint('App/Models/Modules/Mails/List', (faker) => {
  return {
    name: faker.province({ full: true }),
    send_permission: 'members'
  }
})
