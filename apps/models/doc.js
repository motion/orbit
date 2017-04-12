import Model, { query } from './helpers'

class Doc extends Model {
  schema = {
    title: 'Doc2',
    disableKeyCompression: true,
    version: 0,
    required: ['title', 'content', 'board_id'],
    properties: {
      title: {
        type: 'string',
      },
      content: {
        type: 'string',
      },
      board_id: {
        type: 'string',
      },
    }
  }

  @query all = () => {
    return this.table.find()
  }
}

export default new Doc()
