// @flow
import global from 'global'
import { Model, str, object } from '@mcro/model'
import { cleanId, findOrUpdate } from './helpers'

declare class CurrentUser {}

// keep here so we can use as generic
export const methods = {}

export type ThingType = typeof methods & {
  title: string,
  body?: string,
  data?: Object,
  integration: 'github',
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
}

export class Thing extends Model {
  static props = {
    id: str.primary,
    title: str.indexed,
    integration: str,
    type: str.indexed,
    body: str.optional,
    data: object.optional,
    parentId: str.optional,
    author: str.optional,
    created: str.indexed,
    updated: str.indexed,
    orgName: str.indexed,
    timestamps: true,
  }

  methods = methods

  settings = {
    database: 'things',
  }

  hooks = {
    preInsert: (doc: Object) => {
      doc.id = cleanId(doc)
    },
  }

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
      id: thing.id, // || thing.data.id,
      title: thing.title,
      type: thing.type,
      iconAfter: true,
      icon: icon === 'github' ? <item>{thing.number}</item> : `social-${icon}`,
      data: thing,
      ...extra,
    }
  }
}

const ThingInstance = new Thing()
global.Thing = ThingInstance

export default ThingInstance
