'use strict'

const Factory = use('Factory')
const Database = use('Database')
const faker = require('chance').Chance()

class ModulesBlogArticlesSeeder {
  async run () {
    const users = await Database.table('users')

    const articles = await Factory
      .model('App/Models/Modules/Blog/Article')
      .createMany(5)

    for (let article of articles) {
      article.merge({ title: faker.sentence({ words: 4 }) })
      await article.save()
      await article.author().associate(faker.pickone(users))
    }

    console.log('Seeded Modules/Blog/Articles')
  }
}

module.exports = ModulesBlogArticlesSeeder
