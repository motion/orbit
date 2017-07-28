// @flow
import { Model, query, str, object, array, bool, number } from '@mcro/black'
import Image from './image'
import User from './user'
import { some, last, includes, without } from 'lodash'
import { docToTasks, toggleTask } from './helpers/tasks'
import randomcolor from 'randomcolor'
import { Observable } from 'rxjs'

const urlify = id => id && id.replace(':', '-')
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

export const extend = (a, b) => {
  const result = {}
  const ad = Object.getOwnPropertyDescriptors(a)
  const bd = Object.getOwnPropertyDescriptors(b)
  Object.defineProperties(result, ad)
  Object.defineProperties(result, bd)
  return result
}

export const getTitle = document => {
  // set title to first content node
  try {
    if (document.content && document.content.document) {
      return document.content.document.nodes[0].nodes[0].text || document.title
    }
  } catch (e) {
    console.log('error extracting title', e, document.content)
  }
  return document.title || ''
}

export const getContent = ({ title }) => ({
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
    {
      kind: 'block',
      type: 'paragraph',
      data: {},
      nodes: [
        {
          kind: 'text',
          text: '',
        },
      ],
    },
  ],
})

export const methods = {
  url() {
    return `/${this.type}/${urlify(this.id)}`
  },
  tags() {
    return (
      this.updates &&
      this.updates.reduce((acc, item) => {
        if (item.type === 'tagRemove') {
          return without(acc, item.name)
        }

        if (item.type === 'tag') return [...acc, item.name]
        return acc
      }, [])
    )
  },
  assignedTo() {
    return last(this.updateType('assign').map(({ to }) => to))
  },
  setDefaultContent({ title }) {
    this.content = getContent({ title })
    this.title = title
  },
  get previewText() {
    return (
      //color: '#666',
      this.content.document &&
      this.content.document.nodes
        .filter(n => n.type === 'paragraph')
        .map(n => n.nodes[0].ranges.map(r => r.text).join(' '))
        .join('\n')
        .slice(0, 200)
    )
  },

  titleShort() {
    return this.title && this.title.length > 20
      ? this.title.slice(0, 18) + '...'
      : this.title
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
  hasStar() {
    return this.starredBy.find(id => id === User.id)
  },
  async toggleStar() {
    this.starredBy = toggleInclude(this.starredBy, User.id)
    console.log('toggle starred by')
    await this.save()
  },
  async getCrumbs() {
    // because the root is an Org not Thing
    const thingIds = this.parentIds.slice(1)
    const crumbs = await Promise.all(
      thingIds.map(parentId => this.collection.findOne(parentId).exec())
    )
    return [...crumbs, this]
  },
  getChildren({ depth = 1, find } = {}) {
    const next = (curDepth, isRoot) => parent => {
      if (!parent) {
        return null
      }
      return this.collection
        .find({ parentId: parent.id, type: { $gt: null }, ...find })
        .sort('createdAt')
        .$.take(1)
        .mergeMap(documents => {
          if (curDepth - 1 === 0) {
            return [documents]
          }
          return Observable.from(documents)
            .mergeMap(next(curDepth - 1, false))
            .toArray()
        })
        .map(children => (isRoot ? children : { ...parent, children }))
    }
    return next(depth, true)(this)
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
  static getContent = getContent
  static getTitle = getTitle

  static props = {
    title: str,
    uid: number,
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

  static defaultProps = ({ title, ...props }) => {
    const type = props.type || 'document'
    return {
      title,
      authorId: User.user ? User.id : 'anon',
      hashtags: [],
      starredBy: [],
      orgId: (User.org && User.org.id) || '',
      updates: [],
      members: [],
      attachments: [],
      childrenSort: [],
      private: true,
      color: randomcolor(),
      slug: toSlug(title),
      type,
    }
  }

  methods = methods

  settings = {
    database: 'documents',
    index: ['createdAt', 'updatedAt'],
  }

  hooks = {
    preInsert: async doc => {
      await this.ensureParentIds(doc)
      await this.ensureUid(doc)
    },
  }

  @query
  get = (query: Object | string) => {
    if (!query) {
      return null
    }
    const query_ = cleanGetQuery(query)
    return this.collection.findOne(query_)
  };

  @query
  user = () => {
    if (!User.loggedIn) {
      return null
    }
    return this.collection.find().where('authorId').eq(User.name)
  }

  async ensureParentIds(doc) {
    if (!doc.parentId) {
      throw new Error('No parentId given!')
    }
    if (!doc.parentIds) {
      const parent = await this._collection.findOne(doc.parentId).exec()
      doc.parentIds = [...parent.parentIds, doc.parentId]
    }
  }

  async ensureUid(doc) {
    if (!doc.uid) {
      const last = await this._collection.findOne().sort('createdAt').exec()
      if (!last) {
        doc.uid = 1
      } else {
        doc.uid = last.uid + 1
      }
    }
  }
}

const ThingInstance = new Thing()
window.Thing = ThingInstance

export default ThingInstance
