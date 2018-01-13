// @flow
import global from 'global'
import { IndexDB, Model, str, object } from '@mcro/model'
import { cleanId, findOrUpdate } from './helpers'

declare class CurrentUser {}

const db = new IndexDB()
const getHost = url => new URL(url).host.replace(/^www\./, '')

export type ThingType = typeof methods & {
  title: string,
  body?: string,
  data?: Object,
  integration: string,
  type: string,
  id?: string,
  author?: string,
  date: string,
  bucket?: string,
  baseUrl: string,
  url?: string,
  created: string,
  updated: string,
  createdAt: string,
  updatedAt: string,
}

export class Thing extends Model {
  version = Math.random()

  static props = {
    id: str.primary,
    title: str.indexed,
    integration: str,
    type: str.indexed,
    data: object.optional,
    author: str.optional,
    bucket: str.optional,
    url: str.optional.unique,
    created: str.indexed,
    updated: str.indexed,
    timestamps: true,
  }

  methods = {
    get host() {
      return (this.url && getHost(this.url)) || ''
    },
  }

  asyncMethods = {
    async body() {
      const res = await db.get(this.id)
      return res ? res.body : ''
    },
  }

  settings = {
    database: 'things',
  }

  hooks = {
    preInsert: async (doc: Object) => {
      doc.id = cleanId(doc)
      const now = new Date().toISOString()
      doc.created = doc.created || now
      doc.updated = doc.updated || now

      if (!doc.bucket) {
        doc.bucket = this.currentUser.bucket
      }

      // body shim
      if (typeof doc.body === 'string') {
        db.put({ id: doc.id, body: doc.body })
      }

      // always delete because it may actually be undefined
      delete doc.body

      if (doc.url && (await ThingInstance.get({ url: doc.url }))) {
        throw new Error(`Thing already exists with this url`)
      }

      console.log('creating doc', doc)
    },
  }

  cleanId = cleanId
  findOrUpdate = findOrUpdate

  search = async (text: string) => {
    if (!text) {
      return null
    }
    const { rows } = await this.pouch.search({
      query: text,
      fields: ['body', 'title'],
      include_docs: false,
      highlighting: false,
    })
    const ids = rows.map(row => row.id)
    return await this.collection.find({ _id: { $in: ids } }).exec()
  }

  setCurrentUser = (currentUser: CurrentUser) => {
    this.currentUser = currentUser
  }

  getIcon(thing) {
    return thing.integration === 'google'
      ? thing.integration + '-' + thing.type
      : thing.integration
  }

  toResult(thing: Thing, extra): PaneResult {
    const id = thing.id || (thing.data && thing.data.id)
    if (typeof id === 'undefined') {
      throw new Error(
        `Thing with no id given: ${JSON.stringify(thing.toJSON())}`,
      )
    }
    return {
      id,
      title: thing.title,
      type: 'context',
      data: thing,
      ...extra,
    }
  }

  fromCrawl = ({ url, contents, data, type, integration }) => ({
    url,
    title: `${contents.title}`,
    body: `${contents.content}`,
    type: type || 'website',
    data,
    integration,
  })

  createFromCrawl = result =>
    ThingInstance.create(
      this.fromCrawl({
        ...result,
        integration: 'pin-site',
      }),
    )

  createFromPin = result =>
    ThingInstance.create(
      this.fromCrawl({
        ...result,
        integration: 'pin',
      }),
    )
}

const ThingInstance = new Thing()
global.Thing = ThingInstance

export default ThingInstance
