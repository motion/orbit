// @flow
import global from 'global'
import { Model, str, object } from '@mcro/model'
import { cleanId, findOrUpdate } from './helpers'

const COLORS = {
  google: '#204bce',
  github: 'black',
}

// keep here so we can use as generic
export const methods = {
  get hasData(): boolean {
    return this.data.payload && this.data.payload.commits
  },

  get integrationColor() {
    return COLORS[this.integration]
  },
}

export type EventType = typeof methods & {
  author?: string,
  integration: string,
  type: string,
  action: string,
  data?: Object,
  parentId?: string,
  id?: string,
  org?: string,
  createdAt: string,
  updatedAt: string,
  created?: string,
  updated?: string,
}

export class Event extends Model {
  static props = {
    id: str.primary,
    integration: str.indexed,
    type: str.indexed,
    action: str.indexed,
    parentId: str.optional,
    org: str.indexed.optional,
    author: str.optional,
    data: object.optional,
    created: str.indexed.optional,
    updated: str.indexed.optional,
    timestamps: true,
  }

  methods = methods

  settings = {
    database: 'events',
  }

  hooks = {
    preInsert: (doc: Object) => {
      doc.id = cleanId(doc)
    },
  }

  findOrUpdate = findOrUpdate
}

const EventInstance = new Event()
global.Event = EventInstance

export default EventInstance
