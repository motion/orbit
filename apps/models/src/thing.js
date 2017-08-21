// @flow
import global from 'global'
import { Model, query, str, object, array, bool, number } from '@mcro/model'

let User = null

export const extend = (a, b) => {
  const result = {}
  const ad = Object.getOwnPropertyDescriptors(a)
  const bd = Object.getOwnPropertyDescriptors(b)
  Object.defineProperties(result, ad)
  Object.defineProperties(result, bd)
  return result
}

// keep here so we can use as generic
export const methods = {}

export type ThingType = typeof methods & {
  title: str,
  type: 'document' | 'inbox' | 'thread' | 'reply',
}

export class Thing extends Model {
  static props = {
    title: str,
    type: str,
    timestamps: true,
  }

  methods = methods

  settings = {
    database: 'thing',
    index: ['createdAt', 'updatedAt'],
  }

  hooks = {
    preInsert: async doc => {
      // doc
    },
  }

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

  setCurrentUser = currentUser => {
    User = currentUser
  }
}

const ThingInstance = new Thing()
global.Thing = ThingInstance

export default ThingInstance
