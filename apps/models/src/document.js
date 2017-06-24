// @flow

import { Model, query, str, object, array, bool } from '@jot/black'
import Image from './image'
import User from './user'
import generateName from 'sillyname'
import { memoize, includes, without } from 'lodash'
import { docToTasks, toggleTask } from './helpers/tasks'

const toSlug = str => `${str}`.replace(/ /g, '-').toLowerCase()
const toID = str => `${str}`.replace(/-/g, ':').toLowerCase()
const toggleInclude = (xs, val) =>
  includes(xs, val) ? without(xs, val) : [...xs, val]

const cleanGetQuery = (query: Object | string) => {
  if (typeof query === 'string') {
    return toID(query)
  }
  return query
}

const DEFAULT_CONTENT = title => ({
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

export class Document extends Model {
  static props = {
    title: str,
    content: object,
    text: str.optional,
    authorId: str,
    parentId: str.optional,
    members: array.items(str),
    hashtags: array.items(str),
    attachments: array.optional.items(str),
    starredBy: array.items(str),
    private: bool,
    slug: str,
    draft: bool.optional,
    timestamps: true,
  }

  static defaultProps = props => {
    const title = props.title || generateName()

    return {
      title,
      authorId: User.user ? User.authorId : 'anon',
      hashtags: [],
      starredBy: [],
      members: [],
      attachments: [],
      private: true,
      content: DEFAULT_CONTENT(title),
      slug: toSlug(title || Math.random()),
    }
  }

  DEFAULT_CONTENT = DEFAULT_CONTENT

  settings = {
    database: 'documents',
    index: ['createdAt', 'updatedAt'],
  }

  hooks = {
    preSave: async ({ slug }) => {
      if (await this.get(slug).exec()) {
        throw new Error(`Already exists a place with this slug! ${slug}`)
      }
    },
  }

  tasksCache = {
    lastUpdated: 0,
    value: [],
  }

  methods = {
    url() {
      return `/d/${this._id.replace(':', '-')}`
    },
    tasks() {
      // const { lastUpdated, value: cacheValue } = this.tasksCache
      // if (lastUpdated >= this.updatedAt) return cacheValue
      return docToTasks(this)
    },
    hasStar() {
      return includes(this.starredBy, User.authorId)
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
        if (!doc.parentId) {
          foundRoot = true
        } else {
          if (!doc) {
            return crumbs
          }
          crumbs = [doc, ...crumbs]
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
    getTitle() {
      try {
        if (this.content.nodes) {
          return this.content.nodes[0].nodes[0].text
        }
        return this.content.document.nodes[0].nodes[0].ranges[0].text
      } catch (e) {
        console.log('err no title node!', this._id)
        return this.title
      }
    },
    togglePrivate() {
      this.private = !this.private
      this.save()
    },
    async addImage(file) {
      return await Image.create({
        file,
        name: ('image' + Math.random()).slice(0, 8),
        docId: this._id,
      })
    },
    // todo if two tasks have the same name, they'll switch together
    async toggleTask(text) {
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

  search = async text => {
    // return recent
    if (text === '') {
      return await this.collection
        .find({ draft: { $ne: true } })
        // .sort({ createdAt: 'desc' })
        .limit(20)
        .exec()
    }

    const ids = (await this.pouch.search({
      query: text,
      fields: ['text', 'title'],
      include_docs: false,
      highlighting: false,
    })).rows.map(row => row.id)

    return await this.collection.find({ _id: { $in: ids } }).exec()
  }

  @query
  userHomeDocs = userId => {
    if (!userId) {
      return null
    }
    return this.collection.find({
      parentId: { $exists: false },
      draft: { $ne: true },
    })
  }

  @query
  child = id => {
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

  @query
  all = () =>
    this.collection
      .find({ createdAt: { $gt: null } })
      .sort({ createdAt: 'asc' })

  @query
  recent = (limit = 10) =>
    this.collection
      .find({ draft: { $ne: true } })
      // .sort({ createdAt: 'desc' })
      .limit(limit)

  @query root = () => this.collection.find({ parentId: { $exists: false } })

  @query
  stars = () =>
    this.collection
      .find({ starredBy: { $elemMatch: { $eq: User.authorId } } })
      // .sort({ createdAt: 'desc' })
      .limit(50)

  @query
  get = memoize(query => {
    if (!query) {
      return null
    }
    const query_ = cleanGetQuery(query)
    return this.collection.findOne(query_)
  });

  @query home = () => this.collection.findOne({ draft: { $ne: true } })

  @query
  user = user => {
    if (!User.loggedIn) {
      return null
    }
    return this.collection.find().where('authorId').eq(User.name)
  }
}

export default new Document()
