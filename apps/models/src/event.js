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
}

const EventInstance = new Event()
global.Event = EventInstance

export default EventInstance
