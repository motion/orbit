import Model, { query } from './helpers'
import Board from './board'

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

    @query boards() {
      return Board.collection.find().where('place_id').eq(this._id)
    },

    createBoard(info) {
      console.log('creating board', this)
      return Board.collection.insert({
        ...info,
        place_id: this._id,
      })
    }
  }

  @query all = () =>
    this.collection.find()

  @query get = (title) =>
    this.collection.findOne().where('title').eq(title)
}

export default new Place()
