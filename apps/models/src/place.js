import App from './index'
import { Model, query, str, array } from './helpers'
import Board from './board'

class Place extends Model {
  static props = {
    author_id: str,
    title: str,
    primary_doc_id: str.optional,
    timestamps: true,
    layout: array.optional,
  }

  static defaultProps = () => ({
    author_id: App.user.name,
    layout: [],
  })

  settings = {
    title: 'Place',
  }

  methods = {
    url() {
      return `/g/${this.title.replace(' ', '-').toLowerCase()}`
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
