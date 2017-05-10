import App from './index'
import { Model, query, str, array, bool } from './helpers'
import Document from './document'
import Board from './board'
import { capitalize } from 'lodash'

const toSlug = str => str.replace(/ /g, '-').toLowerCase()

class Place extends Model {
  static props = {
    authorId: str,
    title: str,
    slug: str,
    private: bool,
    primary_docId: str.optional,
    layout: array.optional,
    members: array.items(str),
    timestamps: true,
  }

  static defaultProps = props => ({
    private: false,
    authorId: App.user && App.user.name,
    layout: [],
    members: [],
    slug: toSlug(props.title),
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

  hooks = {
    async preInsert(data) {
      if (await this.get(data.slug).exec()) {
        throw new Error(`Already exists a place with this slug! ${data.slug}`)
      }
    },
  }

  methods = {
    url() {
      return `/g/${this.slug}`
    },
    @query boards() {
      return Board.collection.find().where('placeId').eq(this._id)
    },
    @query docs() {
      return Document.collection
        .find()
        .where('places')
        .elemMatch({ $eq: this.slug })
    },
    createBoard(info) {
      return Board.collection.insert({
        ...info,
        placeId: this._id,
      })
    },
    togglePrivate() {
      this.private = !this.private
      this.save()
    },
    toggleSubscribe() {
      if (!App.loggedIn) return
      const indexOfUser = this.members.indexOf(App.user._id)
      if (indexOfUser >= 0) {
        this.members.push(App.user._id)
        this.save()
      } else {
        this.members.splice(indexOfUser, 1)
        this.save()
      }
    },
    subscribed() {
      return App.loggedIn && this.members.indexOf(App.user._id) >= 0
    },
  }

  @query all = () => this.collection.find()

  @query get = (slug: string) => {
    if (!slug) {
      return null
    }
    return this.collection.findOne().where('slug').eq(slug)
  };
}

export default new Place()
