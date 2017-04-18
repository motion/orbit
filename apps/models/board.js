import { Model, query, str } from './helpers'
import App from './index'

class Board extends Model {
  static props = {
    title: str,
    author_id: str,
    place_id: str,
  }

  settings = {
    title: 'Board2',
    disableKeyCompression: true,
    version: 0,
  }

  hooks = {
    preInsert(doc) {
      doc.author_id = App.user.name
    },
  }

  @query all = () => {
    return this.collection.find()
  }
}

export default new Board()
