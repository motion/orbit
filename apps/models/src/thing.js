// @flow
import { Model, query, str, object, array, bool } from '@mcro/black'
import Image from './image'
import User from './user'
import { some, last, includes, without } from 'lodash'
import { docToTasks, toggleTask } from './helpers/tasks'
import randomcolor from 'randomcolor'

const toSlug = (str: string) =>
  `${str}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
const toID = (str: string) => `${str}`.replace(/-/g, ':').toLowerCase()
const toggleInclude = (xs, val) =>
  includes(xs, val) ? without(xs, val) : [...xs, val]

const cleanGetQuery = (query: Object | string) => {
  if (typeof query === 'string') {
    return toID(query)
  }
  return query || {}
}

export const methods = {
  get tags() {
    return this.updateType('tag').map(tag => tag.name)
  },

  get assignedTo() {
    return last(this.updateType('assign').map(({ to }) => to))
  },

  get titleShort() {
    return this.title && this.title.length > 20
      ? this.title.slice(0, 18) + '...'
      : this.title
  },
  url() {
    return `/d/${this._id && this._id.replace(':', '-')}`
  },
  tasks() {
    // const { lastUpdated, value: cacheValue } = this.tasksCache
    // if (lastUpdated >= this.updatedAt) return cacheValue
    return docToTasks(this)
  },
  updateType(type) {
    return (this.updates || []).filter(update => update.type === type)
  },
  addUpdate(update) {
    update.createdAt = +Date.now()
    this.updates = [...this.updates, update]
  },
  get hasStar() {
    return this.starredBy.find(id => id === User.id)
  },
  async toggleStar() {
    this.starredBy = toggleInclude(this.starredBy, User.id)
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
  async getChildren({ max = 30 } = {}) {
    const children = await this.collection
      .find({ parentId: this._id })
      .limit(max / 2)
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

export type ThingType = typeof methods & {
  title: str,
  content?: object,
  text?: str,
  authorId: str,
  color: str,
  parentId?: str,
  members: Array<string>,
  hashtags: Array<string>,
  parentIds: Array<string>,
  attachments?: Array<string>,
  starredBy: Array<string>,
  childrenSort?: Array<string>,
  updates: Array<object>,
  private: boolean,
  slug: str,
  draft?: boolean,
  createdAt: string,
  updatedAt: string,
  type: 'document' | 'inbox' | 'thread' | 'reply',
}

export class Thing extends Model {
  static getContent = ({ title }) => ({
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
            text: title || 'Hello World',
          },
        ],
      },
    ],
  })
  static getTitle = document => {
    // set title to first content node
    try {
      if (document.content) {
        return (
          document.content.document.nodes[0].nodes[0].text || document.title
        )
      }
    } catch (e) {
      console.log('error extracting title', e, document.content)
    }
    return document.title || ''
  }

  static props = {
    title: str,
    content: object.optional,
    text: str.optional,
    authorId: str,
    color: str,
    orgId: str.optional,
    members: array.items(str),
    updates: array.items(object),
    hashtags: array.items(str),
    parentId: str.optional,
    parentIds: array.items(str),
    attachments: array.optional.items(str),
    labels: array.optional.items(str),
    assignees: array.optional.items(str),
    starredBy: array.items(str),
    private: bool,
    home: bool.optional,
    slug: str,
    draft: bool.optional,
    type: str,
    timestamps: true,
    childrenSort: array.optional.items(str),
  }

  static defaultProps = ({ title, parentId, ...props }) => {
    const type = props.type || 'document'
    return {
      title,
      authorId: User.user ? User.id : 'anon',
      hashtags: [],
      starredBy: [],
      updates: [],
      members: [],
      attachments: [],
      childrenSort: [],
      parentIds: parentId ? [parentId] : [],
      private: true,
      color: randomcolor(),
      slug: toSlug(title),
      type,
    }
  }

  settings = {
    database: 'documents',
    index: ['createdAt', 'updatedAt'],
  }

  methods = methods

  @query
  get = (query: Object | string) => {
    if (!query) {
      return null
    }
    const query_ = cleanGetQuery(query)
    log('querying with', query_)
    return this.collection.findOne(query_)
  };

  @query
  user = () => {
    if (!User.loggedIn) {
      return null
    }
    return this.collection.find().where('authorId').eq(User.name)
  }
}

const ThingInstance = new Thing()
window.Thing = ThingInstance

export default ThingInstance
