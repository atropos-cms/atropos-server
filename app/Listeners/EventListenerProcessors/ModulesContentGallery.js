class ModulesContentGallery {
  async processData (type, data) {
    let images = (await data.images().fetch()).toJSON()

    return {
      scope: 'public',
      entity_id: data.id,
      content: {
        title: data.title,
        images: images.slice(-5)
      }
    }
  }

  setNew () {

  }

  updateExisting () {

  }
}

module.exports = ModulesContentGallery
