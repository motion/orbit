import Model, { query } from './helpers'

class Place extends Model {
  schema = {
    title: 'Place4',
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
    }
  }

  @query all = () => {
    return this.table.find()
  }
}

export default new Place()
