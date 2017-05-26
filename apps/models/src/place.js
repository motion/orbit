// @flow
import App from './app'
import { Model, query, str, array, bool } from './helpers'
import Document from './document'
import { capitalize, some, remove } from 'lodash'

const toSlug = str => str.replace(/ /g, '-').toLowerCase()

class Place extends Model {
  static props = {
    authorId: str,
    title: str,
    slug: str,
    private: bool,
    documentId: str.optional,
    members: array.items(str),
    timestamps: true,
  }

  static defaultProps = props => ({
    private: false,
    authorId: App.user && App.user.name,
    members: [],
    slug: toSlug(props.title),
  })

  async create(props) {
    const place = await super.create(props)
    const document = await Document.create({
      placeId: place._id,
      places: [place._id],
      title: capitalize(props.title),
    })
    place.documentId = document._id
    place.save()
    place.document = document
    return place
  }

  settings = {
    title: 'Place',
    index: ['createdAt'],
  }

  hooks = {
    preSave: async ({ slug }) => {
      if (await this.get(slug).promise) {
        throw new Error(`Already exists a place with this slug! ${slug}`)
      }
    },
    postSave: ({ _id, title }) => {
      if (_id) {
        Document.homeForPlace(_id).promise.then(doc => {
          if (doc && doc.title !== title) {
            doc.title = title
            doc.save()
          }
        })
      }
    },
  }

  methods = {
    url() {
      return `/g/${this.slug}`
    },
    @query docs() {
      return Document.collection
        .find()
        .where('places')
        .elemMatch({ $eq: this.slug })
    },
    togglePrivate() {
      this.private = !this.private
      this.save()
    },
    toggleSubscribe() {
      if (App.loggedIn) {
        const exists = some(this.members, m => m === App.user.name)
        if (exists) {
          this.members = this.members.filter(m => m !== App.user.name)
        } else {
          this.members = [...this.members, App.user.name]
        }
        this.save()
      }
    },
    subscribed() {
      return App.loggedIn && this.members.indexOf(App.user.name) >= 0
    },
  }

  @query all = find => this.collection.find(find)

  @query get = (find: string | Object) => {
    if (!find) {
      return null
    }
    return this.collection.findOne(find)
  };
}

export default new Place()
