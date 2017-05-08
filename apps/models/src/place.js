import App from './index'
import { Model, query, str, array } from './helpers'
import Document from './document'
import Board from './board'
import { capitalize } from 'lodash'

class Place extends Model {
  static props = {
    authorId: str,
    title: str,
    slug: str,
    primary_docId: str.optional,
    layout: array.optional,
    timestamps: true,
  }

  static defaultProps = props => ({
    authorId: App.user.name,
    layout: [],
    slug: props.title.replace(/ /g, '-').toLowerCase(),
  })

  createWithHome = async title => {
    const place = await this.create({ title })
    const doc = await Document.create({
      home: true,
      places: [place.slug],
      title: capitalize(title),
    })
  }

  settings = {
    title: 'Place',
    index: ['createdAt'],
  }

  methods = {
    url() {
      return `/g/${this.slug}`
    },
    @query boards() {
      return Board.collection.find().where('placeId').eq(this._id)
    },
    @query docs() {
      return Document.collection.find().where('places').eq([this._id])
    },
    createBoard(info) {
      return Board.collection.insert({
        ...info,
        placeId: this._id,
      })
    },
  }

  @query all = () => this.collection.find()

  @query get = slug => {
    if (!slug) {
      return null
    }
    return this.collection.findOne().where('slug').eq(slug)
  };
}

export default new Place()
