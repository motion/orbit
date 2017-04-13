import Model, { query } from './helpers'

class Place extends Model {
  schema = {
    title: 'Place',
    disableKeyCompression: true,
    version: 0,
    required: ['author_id', 'title'],
    properties: {
      author_id: {
        type: 'string',
      },
      title: {
        type: 'string',
      }
    },
  }

  statics = {
    url() {
      return `/g/${this.title.toLowerCase()}`
    },
  }

  @query all = () => {
    return this.table.find()
  }
}

export default new Place()
