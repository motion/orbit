import App from './index'
import { Model, query, str } from './helpers'
import Board from './board'

class Place extends Model {
  static props = {
    author_id: str,
    title: str,
    created_at: str.datetime,
    updated_at: str.datetime,
    primary_doc_id: str.optional,
  }

  static defaultProps = () => ({
    author_id: App.user.name,
  })

  settings = {
    title: 'Place',
  }

  methods = {
    url() {
      return `/g/${this.title.toLowerCase()}`
    },

    @query boards() {
      return Board.collection.find().where('place_id').eq(this._id)
    },

    createBoard(info) {
      return Board.collection.insert({
        ...info,
        place_id: this._id,
      })
    },
  }

  @query all = () => this.collection.find()

  @query get = title => this.collection.findOne().where('title').eq(title);
}

export default new Place()
