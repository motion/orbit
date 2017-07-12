// @flow
import { Model, query, str, object, array, bool } from '@mcro/black'
import Image from './image'
import User from './user'
import generateName from 'sillyname'
import { some, includes, without } from 'lodash'
import { docToTasks, toggleTask } from './helpers/tasks'
import randomcolor from 'randomcolor'

const toSlug = (str: string) => `${str}`.replace(/ /g, '-').toLowerCase()
const toID = (str: string) => `${str}`.replace(/-/g, ':').toLowerCase()
const toggleInclude = (xs, val) =>
  includes(xs, val) ? without(xs, val) : [...xs, val]

const cleanGetQuery = (query: Object | string) => {
  if (typeof query === 'string') {
    return toID(query)
  }
  return query || {}
}

const DEFAULT_CONTENT = (title: string) => ({
  nodes: [
    {
      kind: 'block',
      type: 'title',
      data: {
        level: 1,
      },
      nodes: [
        {
          kind: 'text',
          text: title,
        },
      ],
    },
  ],
})

export const methods = {
  url(): string {
    return `/d/${this._id.replace(':', '-')}`
  },
  tasks() {
    // const { lastUpdated, value: cacheValue } = this.tasksCache
    // if (lastUpdated >= this.updatedAt) return cacheValue
    return docToTasks(this)
  },
  hasStar() {
    return this.starredBy.find(id => id === User.authorId)
  },
  async toggleStar() {
    this.starredBy = toggleInclude(this.starredBy, User.authorId)
    await this.save()
  },
  async getCrumbs() {
    let foundRoot = false
    let crumbs = []
    let doc = this
    while (!foundRoot) {
      crumbs = [doc, ...crumbs]
      if (!doc.parentId) {
        foundRoot = true
      } else {
        if (!doc) {
          return crumbs
        }
        const next = await this.collection.findOne(doc.parentId).exec()
        if (!next) {
          console.error('weird, no doc at this crumb', next)
          return crumbs
        }
        doc = next
      }
    }
    return crumbs
  },
  async getChildren({ max = 10 }: { max: number } = {}) {
    const children = await this.collection
      .find({ parentId: this._id })
      .limit(max / 3)
      .exec()
    if (children.length < max) {
      for (const child of children) {
        child.children = await this.collection
          .find({ parentId: child._id })
          .limit(max / 3)
          .exec()
      }
    }
    return children
  },
  togglePrivate() {
    this.private = !this.private
    this.save()
  },
  async addImage(file: any) {
    return await Image.create({
      file,
      name: ('image' + Math.random()).slice(0, 8),
      docId: this._id,
    })
  },
  // todo if two tasks have the same name, they'll switch together
  async toggleTask(text: string) {
    this.content = toggleTask(this.content, text)
    await this.save()
  },
  toggleSubscribe() {
    if (User.loggedIn) {
      const exists = some(this.members, m => m === User.user.name)
      if (exists) {
        this.members = this.members.filter(m => m !== User.user.name)
      } else {
        this.members = [...this.members, User.user.name]
      }
      this.save()
    }
  },
  subscribed() {
    return User.loggedIn && this.members.indexOf(User.user.name) >= 0
  },
}

export type DocumentType = typeof methods & {
  title: str,
  content: object,
  text?: str,
  authorId: str,
  color: str,
  parentId?: str,
  members: Array<string>,
  hashtags: Array<string>,
  parentIds: Array<string>,
  attachments?: Array<string>,
  starredBy: Array<string>,
  private: boolean,
  slug: str,
  draft?: boolean,
  createdAt: string,
  updatedAt: string,
}

export class DocumentModel extends Model {
  static props = {
    title: str,
    content: object,
    text: str.optional,
    authorId: str,
    color: str,
    parentId: str.optional,
    members: array.items(str),
    hashtags: array.items(str),
    parentIds: array.items(str),
    attachments: array.optional.items(str),
    starredBy: array.items(str),
    private: bool,
    home: bool.optional,
    slug: str,
    draft: bool.optional,
    timestamps: true,
  }

  static defaultProps = (props: Object) => {
    const title = props.title || generateName()
    return {
      title,
      authorId: User.user ? User.authorId : 'anon',
      hashtags: [],
      starredBy: [],
      members: [],
      attachments: [],
      parentIds: [],
      private: true,
      content: DEFAULT_CONTENT(title),
      color: randomcolor(),
      slug: toSlug(title),
    }
  }

  DEFAULT_CONTENT = DEFAULT_CONTENT

  settings = {
    database: 'documents',
    index: ['createdAt', 'updatedAt'],
  }

  hooks = {
    preSave: async (document: Object) => {
      const doc = this.get(document.slug)
      if (doc && (await doc.exec())) {
        throw new Error(
          `Already exists a place with this slug! ${document.slug}`
        )
      }

      // set title to first content node
      try {
        if (this.content.nodes) {
          doc.title = this.content.nodes[0].nodes[0].text
        } else {
          doc.title = this.content.document.nodes[0].nodes[0].ranges[0].text
        }
      } catch (e) {
        console.log('error extracting title', e)
      }
    },
  }

  tasksCache = {
    lastUpdated: 0,
    value: [],
  }

  methods = methods

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

  @query all = () => this.collection.find()
  // .find({ createdAt: { $gt: null } })
  // .sort({ createdAt: 'asc' })

  @query
  recent = (limit: number = 10) =>
    this.collection
      .find({ draft: { $ne: true } })
      // .sort({ createdAt: 'desc' })
      .limit(limit)

  @query root = () => this.collection.find({ parentId: { $exists: false } })

  @query
  stars = () =>
    this.collection
      .find({
        starredBy: { $elemMatch: { $eq: User.authorId } },
        createdAt: { $gt: null },
      })
      // .sort({ createdAt: 'asc' })
      .limit(50)

  @query
  get = (query: Object | string) => {
    if (!query) {
      return null
    }
    const query_ = cleanGetQuery(query)
    return this.collection.findOne(query_)
  };

  @query home = () => this.collection.findOne({ draft: { $ne: true } })

  @query
  user = () => {
    if (!User.loggedIn) {
      return null
    }
    return this.collection.find().where('authorId').eq(User.name)
  }
}

const Document = new DocumentModel()
window.Document = Document

export default Document
