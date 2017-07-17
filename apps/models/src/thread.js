import { Model, query, bool, str } from '@mcro/black'
import User from './user'

class Thread extends Model {
  static props = {
    docId: str,
    title: str,
    draft: bool,
    authorId: str,
    timestamps: true,
  }

  static defaultProps = () => ({
    draft: false,
    authorId: User.id,
  })

  settings = {
    database: 'threads',
    index: ['createdAt'],
  }

  hooks = {
    preInsert(comment) {
      comment.authorId = User.name
    },
  }

  methods = {}

  @query
  all = () => {
    return this.collection.find
  }

  @query forDoc = docId => this.collection.find({ docId, draft: false })
}

export default new Thread()
