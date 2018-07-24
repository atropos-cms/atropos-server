class ModulesBlogArticle {
  async processData (type, data) {
    return {
      scope: 'public',
      entity_id: data.id,
      content: {
        title: data.title
      }
    }
  }

  setNew () {

  }

  updateExisting () {

  }
}

module.exports = ModulesBlogArticle
