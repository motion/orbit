import { Model, query, str, object, array, bool } from './helpers'
import generateName from 'sillyname'

class Doc extends Model {
  static props = {
    title: str,
    content: object,
    board_id: str.optional,
    author_id: str,
    places: array.optional.items(str),
    private: bool,
    timestamps: true,
  }

  static defaultProps = () => ({
    title: generateName(),
    author_id: App.user.name,
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
    title: 'Doc4',
    index: ['created_at'],
  }

  methods = {
    url() {
      return `/d/${this._id.replace(':', '-')}`
    },

    togglePrivate() {
      console.log('toggling')
      this.private = !this.private
      this.save()
    },
  }

  @query all = () => this.collection.find()

  @query recent = () => this.collection.find().sort({ created_at: 'desc' })

  @query get = id => this.collection.findOne(id.replace('-', ':'));

  @query forBoard = name =>
    this.collection
      .find()
      .where('places')
      .elemMatch({ $eq: name })
      .sort({ created_at: 'desc' })
}

export default new Doc()
