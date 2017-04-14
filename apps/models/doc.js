import Model, { query } from './helpers'

class Doc extends Model {
  schema = {
    title: 'Doc4',
    disableKeyCompression: true,
    version: 0,
    required: ['title', 'content', 'author_id'],
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
      author_id: {
        type: 'string',
      },
    }
  }

  methods = {
    url() {
      return `/d/${this.title.toLowerCase()}`
    },
  }

  @query all = () => {
    return this.collection.find()
  }
}

export default new Doc()
