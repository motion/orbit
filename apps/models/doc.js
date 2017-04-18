import { Model, query, str } from './helpers'

class Doc extends Model {
  static props = {
    title: str,
    content: str,
    board_id: str.optional,
    author_id: str,
  }

  settings = {
    title: 'Doc4',
    disableKeyCompression: true,
    version: 0,
  }

  methods = {
    url() {
      return `/d/${this._id.replace(':', '-')}`
    },
  }

  @query all = () => this.collection.find()

  @query get = id => this.collection.findOne().where('_id').eq(id);
}

export default new Doc()
