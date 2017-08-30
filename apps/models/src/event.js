// @flow
import global from 'global'
import { Model, query, str, object } from '@mcro/model'

// keep here so we can use as generic
export const methods = {}

export type EventType = typeof methods & {
  author?: string,
  integration: string,
  type: string,
  data?: Object,
  parentId?: string,
  givenId?: string,
  org?: string,
  createdAt: string,
  updatedAt: string,
}

export class Event extends Model {
  static props = {
    integration: str,
    type: str,
    givenId: str,
    author: str.optional,
    data: object.optional,
    parentId: str.optional,
    org: str.optional,
    timestamps: true,
  }

  methods = methods

  settings = {
    database: 'events',
    index: ['givenId', 'type', 'createdAt', 'updatedAt'],
  }
}

const EventInstance = new Event()
global.Event = EventInstance

export default EventInstance
