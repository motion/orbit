import { Model, query, str, object, array } from './helpers'
import generateName from 'sillyname'

class Doc extends Model {
  static props = {
    title: str,
    content: object,
    board_id: str.optional,
    author_id: str,
    created_at: str.datetime,
    updated_at: str.datetime,
    places: array.optional.items(str),
  }

  static defaultProps = () => ({
    title: generateName(),
    author_id: App.user.name,
    places: ['ddd'],
    content: {
      nodes: [
        {
          kind: 'block',
          type: 'paragraph',
          nodes: [
            {
              kind: 'text',
              text: 'What a delight to see you.',
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
