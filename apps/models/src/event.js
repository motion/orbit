// @flow
import global from 'global'
import { Model, str, object } from '@mcro/model'

const VERB_MAP = {
  PushEvent: () => 'pushed',
  CreateEvent: () => 'created branch',
  IssueCommentEvent: () => 'commented',
  ForkEvent: () => 'forked',
  PullRequestEvent: ({ action }) => `${action} a pull request`,
  WatchEvent: ({ action }) => `${action} watching`,
  IssuesEvent: () => 'created issue',
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
    author: str.optional,
    data: object.optional,
    parentId: str.optional,
    org: str.indexed.optional,
    created: str.indexed.optional,
    updated: str.indexed.optional,
    timestamps: true,
  }

  methods = methods

  settings = {
    database: 'events',
    // version: 1,
  }

  // migrations = {
  //   1: async () => {
  //     console.log('run migration')
  //     // const all = await this.getAll()
  //     // if (all) {
  //     //   all.map(_ => _.remove())
  //     // }
  //   },
  // }
}

const EventInstance = new Event()
global.Event = EventInstance

export default EventInstance
