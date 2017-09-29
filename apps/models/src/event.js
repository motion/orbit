// @flow
import global from 'global'
import { Model, str, object } from '@mcro/model'
import { cleanId, findOrUpdate } from './helpers'

const VERB_MAP = {
  PushEvent: () => 'pushed',
  CreateEvent: () => 'created branch',
  IssueCommentEvent: () => 'commented',
  ForkEvent: () => 'forked',
  PullRequestEvent: ({ action }) => `${action} a pull request`,
  WatchEvent: ({ action }) => `${action} watching`,
  IssuesEvent: () => 'created issue',
  DeleteEvent: () => 'deleted',
}

// keep here so we can use as generic
export const methods = {
  get verb(): string {
    const mapping = VERB_MAP[this.type]
    if (mapping) {
      return mapping((this.data && this.data.payload) || {})
    }
    return ''
  },
  get hasData(): boolean {
    return this.data.payload && this.data.payload.commits
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
