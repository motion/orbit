// @flow
import { query } from '@mcro/black'
import { Thing, methods, extend, withContent } from './thing'

export class Document extends Thing {
  static props = Thing.props
  static defaultProps = doc => ({
    ...Thing.defaultProps(doc),
    ...withContent(doc),
    type: 'document',
  })

  static defaultFilter = doc => ({ type: 'document', ...doc })

  methods = extend(methods, {
    get icon() {
      return 'filesg'
    },
  })

  @query
  search = async (text: string) => {
    if (text === '') {
      return await this.collection
        .find({ draft: { $ne: true } })
        .sort('createdAt')
        .limit(20)
        .exec()
    }

    const { rows } = await this.pouch.search({
      query: text,
      fields: ['text', 'title'],
      include_docs: true,
      highlighting: false,
    })

    const ids = rows.map(row => row.id)
    console.log('ids', ids)

    return await this._collection
      .find({ _id: { $in: ids }, title: { $gt: null } })
      .sort('createdAt')
      .exec()
  }

  @query
  userHomeDocs = (userId: string) => {
    if (!userId) {
      return null
    }
    return this.collection.find({
      parentId: { $exists: false },
      draft: { $ne: true },
    })
  }

  @query
  child = (id: string) => {
    if (!id) {
      return null
    }
    return this.collection
      .find({
        draft: { $ne: true },
      })
      .where('parentId')
      .eq(id)
      .sort({ createdAt: 'desc' })
  }

  @query
  all = () =>
    this.collection
      .find({ threadId: { $exists: false } })
      .sort({ createdAt: 'asc' })

  @query
  recent = (limit: number = 10) =>
    this.collection
      .find({ draft: { $ne: true }, threadId: { $exists: false } })
      .sort({ createdAt: 'desc' })
      .limit(limit)

  @query
  favoritedBy = id => {
    if (!id) {
      return null
    }
    return this.collection
      .find({
        starredBy: { $elemMatch: { $eq: id } },
        createdAt: { $gt: null },
      })
      .sort({ createdAt: 'asc' })
      .limit(50)
  }
}

window.DocumentModel = Document

const DocumentInstance = new Document()
window.Document = DocumentInstance

export default DocumentInstance
