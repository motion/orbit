import { Model, query, str } from './helpers'
import App from './app'

class Board extends Model {
  static props = {
    title: str,
    authorId: str,
    placeId: str,
    timestamps: true,
  }

  settings = {
    title: 'Board2',
  }

  hooks = {
    preInsert(doc) {
      doc.authorId = App.user.name
    },
  }

  @query all = () => this.collection.find()
}

export default new Board()
