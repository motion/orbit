import Model, { query } from './helpers'

class Board extends Model {
  schema = {
    title: 'Board2',
    disableKeyCompression: true,
    version: 0,
    required: ['title', 'author_id', 'place_id'],
    properties: {
      title: {
        type: 'string',
      },
      author_id: {
        type: 'string',
      },
      place_id: {
        type: 'string',
      }
    }
  }

  hooks = {
    preInsert(doc) {
      console.log('pre insert')
      doc.author_id = App.user.name
    }
  }

  @query all = () => {
    return this.collection.find()
  }
}

export default new Board()
