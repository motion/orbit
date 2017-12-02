// @flow
import global from 'global'
import { IndexDB, Model, str, object } from '@mcro/model'
import { cleanId, findOrUpdate } from './helpers'

declare class CurrentUser {}

const resolvedBodies = {}
const db = new IndexDB()

// keep here so we can use as generic
export const methods = {
  // hacky way to have async resolving of bodies for now
  get body() {
    if (this.bodyTEMP) {
      ;(async () => {
        const res = await db.get(this.id)
        if (resolvedBodies[this.id] !== res.body) {
          resolvedBodies[this.id] = res.body
          // hacky, triggers update
          this.bodyTEMP = `${Math.random()}`
          this.save()
        }
      })()
      return resolvedBodies[this.id] || ''
    }
    return ''
  },
}

export type ThingType = typeof methods & {
  title: string,
  body?: string,
  data?: Object,
  integration: string,
  type: string,
  parentId?: string,
  id?: string,
  author?: string,
  createdAt: string,
  updatedAt: string,
  created: string,
  updated: string,
  date: string,
  orgName: string,
  bucket?: string,
  url?: string,
}

export class Thing extends Model {
  static props = {
    id: str.primary,
    title: str.indexed,
    integration: str,
    type: str.indexed,
    bodyTEMP: str.optional,
    data: object.optional,
    parentId: str.optional,
    author: str.optional,
    created: str.indexed,
    updated: str.indexed,
    orgName: str.optional,
    bucket: str.optional,
    url: str.optional.unique,
    timestamps: true,
  }

  methods = methods

  settings = {
    database: 'things',
  }

  hooks = {
    preInsert: async (doc: Object) => {
      doc.id = cleanId(doc)
      const now = new Date().toISOString()
      doc.created = doc.created || now
      doc.updated = doc.updated || now

      // body shim
      if (typeof doc.body !== 'undefined') {
        db.put({ id: doc.id, body: doc.body })
        doc.bodyTEMP = `${Math.random()}`
        delete doc.body
      }

      if (doc.url && (await ThingInstance.get({ url: doc.url }))) {
        throw new Error(`Thing already exists with this url`)
      }
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

  toResult(thing: Thing, extra): PaneResult {
    const icon =
      thing.integration === 'google'
        ? thing.integration + '-' + thing.type
        : thing.integration
    return {
      id: thing.id || thing.data.id,
      title: thing.title,
      type: thing.type,
      iconAfter: true,
      icon: `${icon}`,
      data: thing,
      ...extra,
    }
  }

  createFromCrawlResult = ({ url, contents }) => {
    return ThingInstance.create({
      url,
      title: `${contents.title}`,
      body: `${contents.content}`,
      integration: new URL(url).origin,
      type: 'website',
      bucket: this.bucket || 'Default',
    })
  }
}

const ThingInstance = new Thing()
global.Thing = ThingInstance

export default ThingInstance
