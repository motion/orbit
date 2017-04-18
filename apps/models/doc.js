import { Model, query, str, object } from './helpers'

class Doc extends Model {
  static props = {
    title: str,
    content: object,
    board_id: str.optional,
    author_id: str,
  }

  static defaultProps = () => ({
    author_id: App.user.name,
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
  }

  methods = {
    url() {
      return `/d/${this._id.replace(':', '-')}`
    },
  }

  create(title) {
    this.collection.insert({
      title,
      ...this.constructor.defaultProps(),
    })
  }

  @query all = () => this.collection.find()
  @query get = id => this.collection.findOne(id)
}

export default new Doc()
