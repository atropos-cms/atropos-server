'use strict'

const Factory = use('Factory')

class ModulesBlogCategoriesSeeder {
  async run () {
    await Factory
      .model('App/Models/Modules/Blog/Category')
      .createMany(8)

    console.log('Seeded Modules/Blog/Categories')
  }
}

module.exports = ModulesBlogCategoriesSeeder
