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

  static defaultProps = props => ({
    title: generateName(),
    authorId: App.user.name,
    places: ['ddd'],
    private: true,
    content: {
      nodes: [
        {
          kind: 'block',
          type: 'title',
          data: {
            level: 1,
          },
          nodes: [
            {
              kind: 'text',
              text: props.title || 'lorem ipsum',
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

  @query forPlace = slug => {
    if (!slug) {
      return null
    }
    return this.collection
      .find()
      .where('places')
      .elemMatch({ $eq: slug })
      .sort({ createdAt: 'desc' })
  }

  @query all = () => this.collection.find()

  @query recent = () => this.collection.find().sort({ createdAt: 'desc' })

  @query get = id => {
    if (!id) return null
    return this.collection.findOne(id.replace('-', ':'))
  };

  @query user = user => {
    if (!App.user) {
      return null
    }
    return this.collection.find().where('authorId').eq(App.user.name)
  }
}

export default new Document()
