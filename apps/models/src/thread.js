import { Model, array, query, bool, str, object } from '@mcro/black'
import User from './user'
import { last } from 'lodash'

class Thread extends Model {
  static props = {
    docId: str,
    title: str,
    draft: bool,
    authorId: str,
    timestamps: true,
    updates: array.optional.items(object),
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

  methods = {
    url() {
      return `/d/${this.docId.replace(':', '-')}`
    },
    updateType(type) {
      return this.updates.filter(update => update.type === type)
    },
    addUpdate(update) {
      update.createdAt = +Date.now()
      this.updates = [...this.updates, update]
    },
  }

  get tags() {
    return this.updateType('tag').map(tag => tag.name)
  }

  get assignedTo() {
    return last(this.updateType('assign').map(({ to }) => to))
  }

  @query
  all = () => {
    return this.collection.find
  }

  @query
  get = _id => {
    return this.collection.findOne({ _id })
  };

  @query
  forDoc = docId =>
    docId
      ? this.collection.find({ docId, draft: false })
      : this.collection.find({ draft: false })
}

export default new Thread()
