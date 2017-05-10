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
    hashtags: array.items(str),
    private: bool,
    home: bool.optional,
    timestamps: true,
  }

  static defaultProps = props => {
    const title = props.title || generateName()
    return {
      title,
      authorId: App.user && App.user.name,
      hashtags: [],
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
                text: title,
              },
            ],
          },
        ],
      },
    }
  }

  settings = {
    title: 'documents',
    index: ['createdAt'],
  }

  methods = {
    url() {
      return `/d/${this._id.replace(':', '-')}`
    },
    getTitle() {
      if (this.content.nodes) {
        return this.content.nodes[0].nodes[0].text
      }
      return this.content.document.nodes[0].nodes[0].ranges[0].text
    },
    togglePrivate() {
      this.private = !this.private
      this.save()
    },
  }

  @query homeForPlace = slug => {
    if (!slug) {
      return null
    }

    return (
      this.collection
        .findOne()
        .where('home')
        .eq(true)
        .where('places')
        // in array find
        .elemMatch({ $eq: slug })
    )
  }

  @query forPlace = slug => {
    if (!slug) {
      return null
    }

    return (
      this.collection
        .find({
          home: { $ne: true },
        })
        .where('places')
        // in array find
        .elemMatch({ $eq: slug })
        .sort({ createdAt: 'desc' })
    )
  }

  @query all = () => this.collection.find()

  @query recent = (limit = 10) =>
    this.collection.find().sort({ createdAt: 'desc' }).limit(limit)

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
