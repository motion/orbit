import { Model, query, str } from './helpers'
import User from './user'

class Comment extends Model {
  static props = {
    parentId: str,
    authorId: str,
    docId: str,
    body: str,
    timestamps: true,
  }

  settings = {
    database: 'comments',
    index: ['createdAt'],
  }

  hooks = {
    preInsert(comment) {
      comment.authorId = User.name
      comment.parentId = comment.parentId || ''
    },
  }

  @query all = () => {
    return this.collection.find()
  }

  thread = comments => {
    const threads = {}
    let value
    let comment

    function recurse(comment, threads) {
      for (const thread of threads) {
        value = threads[thread]
        if (thread === comment.parentId) {
          value.children[comment._id] = comment
          return
        }
        if (value.children) {
          recurse(comment, value.children)
        }
      }
    }
  }
}

export default new Comment()
