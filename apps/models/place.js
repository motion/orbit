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

  methods = {
    url() {
      return `/g/${this.title.toLowerCase()}`
    },
  }

  @query all = () => this.table.find()

  @query get(title) {
    return this.table.findOne().where('title').eq(title)
  }

  get2(name) {
    return this.table.findOne().where('title').eq(name)
  }
}

export default new Place()
