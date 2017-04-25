import App from './index'
import { Model, query, str, array } from './helpers'
import Board from './board'

class Place extends Model {
  static props = {
    author_id: str,
    title: str,
    slug: str,
    primary_doc_id: str.optional,
    timestamps: true,
    layout: array.optional,
  }

  static defaultProps = props => ({
    author_id: App.user.name,
    layout: [],
    slug: props.title.replace(/ /g, '-').toLowerCase(),
  })

  settings = {
    title: 'Place',
  }

  methods = {
    url() {
      return `/g/${this.slug}`
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

  @query get = slug => this.collection.findOne().where('slug').eq(slug);
}

export default new Place()
