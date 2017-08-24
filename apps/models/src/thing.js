// @flow
import global from 'global'
import { Model, query, str, object, array, bool, number } from '@mcro/model'

// keep here so we can use as generic
export const methods = {}

export type ThingType = typeof methods & {
  title: string,
  body?: string,
  data?: Object,
  integration: 'github',
  type: 'issue',
  parentId?: string,
  givenId?: string,
  createdAt: string,
  updatedAt: string,
}

export class Thing extends Model {
  static props = {
    title: str,
    body: str.optional,
    integration: str,
    type: str,
    data: object.optional,
    parentId: str.optional,
    givenId: str.optional,
    timestamps: true,
  }

  methods = methods

  settings = {
    database: 'thing',
    index: ['createdAt', 'updatedAt'],
  }

  @query
  search = async (text: string) => {
    if (text === '') {
      return await this.collection.find().sort('createdAt').limit(20).exec()
    }
    const { rows } = await this.pouch.search({
      query: text,
      fields: ['text', 'title'],
      include_docs: true,
      highlighting: false,
    })
    const ids = rows.map(row => row.id)
    return await this._collection
      .find({ _id: { $in: ids }, title: { $gt: null } })
      .sort('createdAt')
      .exec()
  }

  setCurrentUser = currentUser => {
    this.currentUser = currentUser
  }
}

const ThingInstance = new Thing()
global.Thing = ThingInstance

export default ThingInstance
