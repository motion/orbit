// @flow
import global from 'global'
import { Model, str, object } from '@mcro/model'

// keep here so we can use as generic
export const methods = {}

export type EventType = typeof methods & {
  author?: string,
  integration: string,
  type: string,
  data?: Object,
  parentId?: string,
  id?: string,
  org?: string,
  createdAt: string,
  updatedAt: string,
}

export class Event extends Model {
  static props = {
    id: str.primary,
    integration: str,
    type: str,
    author: str.optional,
    data: object.optional,
    parentId: str.optional,
    org: str.optional,
    timestamps: true,
  }

  methods = methods

  settings = {
    database: 'events',
    index: ['type'],
  }
}

const EventInstance = new Event()
global.Event = EventInstance

export default EventInstance
