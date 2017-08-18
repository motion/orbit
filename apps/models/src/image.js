import { Model, query, str } from '@mcro/model'
import User from './user'

class Image extends Model {
  static props = {
    name: str,
    docId: str,
    size: str.optional,
    authorId: str,
    timestamps: true,
  }

  static defaultProps = props => ({
    authorId: User.user && User.name,
  })

  settings = {
    database: 'images',
    index: ['createdAt'],
  }

  methods = {
    attachments() {
      return this._data._attachments
    },
    async addAttachment({ name, file }) {
      return await this.collection.pouch.putAttachment(
        this._id,
        name || file.name,
        this._rev,
        file,
        file.type
      )
    },
    async getAttachment() {
      return URL.createObjectURL(
        await this.collection.pouch.getAttachment(this._id, this.name)
      )
    },
  }

  @query
  getAll = ids => {
    return this.collection.find(ids)
  }

  @query
  get = id => {
    if (!id) return null
    if (Array.isArray(id)) return this.getAll(id)
    return this.collection.findOne(id)
  };

  @query
  forDocument = doc => {
    if (!doc) {
      return null
    }
    console.log('running forDocument')
    return this.collection.find().where('docId').eq(doc.id)
  }

  async create({ file, name, ...props }) {
    const image = await super.create({
      name,
      size: `${file.size}`,
      ...props,
    })
    const attachment = await image.addAttachment({
      file,
      name,
    })
    return image
  }
}

export default new Image()
