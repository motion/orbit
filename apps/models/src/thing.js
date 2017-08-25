// @flow
import global from 'global'
import { Model, query, str, object, array, bool, number } from '@mcro/model'

declare class CurrentUser {}

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
    database: 'things',
    index: ['createdAt', 'updatedAt'],
  }

  @query
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
    return await this.collection.find({ _id: { $in: ids } }).sort('createdAt')
  }

  setCurrentUser = (currentUser: CurrentUser) => {
    this.currentUser = currentUser
  }
}

const ThingInstance = new Thing()
global.Thing = ThingInstance

export default ThingInstance
