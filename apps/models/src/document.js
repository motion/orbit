// @flow
import { query } from '@mcro/black'
import User from './user'
import { Thing, methods, extend } from './thing'

export class Document extends Thing {
  static props = Thing.props
  static defaultProps = doc => ({
    ...Thing.defaultProps(doc),
    type: 'document',
    title: Thing.getTitle(doc),
    content: Thing.getContent(doc),
  })

  static defaultFilter = doc => ({ ...doc, type: 'document' })

  methods = extend(methods, {
    url() {
      return `/doc/${Thing.urlify(this.id)}`
    },
  })

  root = () => this.collection.find(User.org.homeDocument).exec()

  @query
  search = async (text: string) => {
    // return recent
    return null
    // if (text === '') {
    //   return await this.collection
    //     .find({ draft: { $ne: true } })
    //     // .sort({ createdAt: 'desc' })
    //     .limit(20)
    //     .exec()
    // }

    // const ids = (await this.pouch.search({
    //   query: text,
    //   fields: ['text', 'title'],
    //   include_docs: false,
    //   highlighting: false,
    // })).rows.map(row => row.id)

    // return await this.collection.find({ _id: { $in: ids } }).exec()
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
    // .sort({ createdAt: 'desc' })
  }

  @query all = () => this.collection.find({ threadId: { $exists: false } })
  // .find({ createdAt: { $gt: null } })
  // .sort({ createdAt: 'asc' })

  @query
  recent = (limit: number = 10) =>
    this.collection
      .find({ draft: { $ne: true }, threadId: { $exists: false } })
      // .sort({ createdAt: 'desc' })
      .limit(limit)

  @query
  favoritedBy = id => {
    if (!id) {
      return null
    }
    return (
      this.collection
        .find({
          starredBy: { $elemMatch: { $eq: id } },
          createdAt: { $gt: null },
        })
        // .sort({ createdAt: 'asc' })
        .limit(50)
    )
  }
}

const DocumentInstance = new Document()
window.Document = DocumentInstance

export default DocumentInstance
