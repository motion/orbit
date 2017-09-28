// @flow
import global from 'global'
import { Model, str, object } from '@mcro/model'

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
    created: str.indexed,
    updated: str.indexed,
    orgName: str.indexed,
    timestamps: true,
  }

  methods = methods

  settings = {
    database: 'things',
    index: ['title', 'body', 'created', 'createdAt', 'updated', 'updatedAt'],
    // version: 1,
  }

  findOrUpdateByTimestamps = async (info: Object) => {
    const { id, created, updated } = info
    if (!id || !created || !updated) {
      throw new Error('Object must have properties: id, created, updated')
    }
    const stale = await this.get({ id, created: { $ne: created } })
    if (stale) {
      await stale.remove()
    }
    // already exists
    if (updated && (await this.get({ id, updated }))) {
      return false
    }
    // update
    const res = await this.update(info)
    return res
  }

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
}

const ThingInstance = new Thing()
global.Thing = ThingInstance

export default ThingInstance
