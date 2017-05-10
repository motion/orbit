import { Model, query, str, object } from './helpers'

class Image extends Model {
  static props = {
    name: str,
    docId: str,
    // _attachments: object,
    size: str.optional,
    authorId: str,
    timestamps: true,
  }

  static defaultProps = {}

  settings = {
    title: 'images',
    index: ['createdAt'],
  }

  methods = {}

  @query getAll = ids => {
    return this.collection.find(ids)
  }

  @query get = id => {
    if (!id) return null
    if (Array.isArray(id)) return this.getAll(id)
    return this.collection.findOne(id.replace('-', ':'))
  };

  @query forDocument = doc => {
    if (!doc) {
      return null
    }
    return this.collection.find().where('docId').eq(doc.id)
  }
}

export default new Image()
