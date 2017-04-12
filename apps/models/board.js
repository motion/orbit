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

  @query all = () => {
    return this.table.find()
  }
}

export default new Board()
