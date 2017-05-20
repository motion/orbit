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
    primary_docId: str.optional,
    members: array.items(str),
    timestamps: true,
  }

  static defaultProps = props => ({
    private: false,
    authorId: App.user && App.user.name,
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
    return place
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

  @query get = (slug: string) => {
    if (!slug) {
      return null
    }
    return this.collection.findOne().where('slug').eq(slug)
  };
}

export default new Place()
