import { Model, query, str, object, array, bool } from './helpers'
import App from './index'
import generateName from 'sillyname'

class Document extends Model {
  static props = {
    title: str,
    content: object,
    boardId: str.optional,
    authorId: str,
    places: array.optional.items(str),
    private: bool,
    timestamps: true,
  }

  static defaultProps = () => ({
    title: generateName(),
    authorId: App.user.name,
    places: ['ddd'],
    private: true,
    content: {
      nodes: [
        {
          kind: 'block',
          type: 'paragraph',
          nodes: [
            {
              kind: 'text',
              text: 'hello world',
            },
          ],
        },
      ],
    },
  })

  settings = {
    title: 'documents',
    index: ['createdAt'],
  }

  methods = {
    url() {
      return `/d/${this._id.replace(':', '-')}`
    },

    togglePrivate() {
      this.private = !this.private
      this.save()
    },
  }

  @query forPlace = place => {
    if (!place.current) {
      return null
    }
    return (
      this.collection
        .find()
        .where('places')
        // in array find
        .elemMatch({ $eq: place.current.slug })
        .sort({ createdAt: 'desc' })
    )
  }

  @query all = () => this.collection.find()

  @query recent = () => this.collection.find().sort({ createdAt: 'desc' })

  @query get = id => this.collection.findOne(id.replace('-', ':'));

  @query user = user => {
    if (!App.user) {
      return null
    }
    return this.collection.find().where('authorId').eq(App.user.name)
  }
}

export default new Document()
