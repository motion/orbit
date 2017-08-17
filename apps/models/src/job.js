// @flow
import { Model, query, str, number } from '@mcro/black'

export const STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  FINISHED: 2,
  FAILED: 3,
}

export const methods = {}

export type Org = typeof methods & {
  title: str,
  members: Array<string>,
  private: boolean,
  slug: str,
  timestamps: true,
}

export class JobModel extends Model {
  static props = {
    percent: number,
    tries: number,
    status: number,
    lastError: str.optional,
    timestamps: true,
  }

  static defaultProps = {
    percent: 0,
    tries: 0,
    status: 0,
  }

  settings = {
    database: 'jobs',
    index: ['createdAt', 'updatedAt'],
  }

  hooks = {}

  methods = methods

  @query
  pending = () => {
    return this.collection.find({ status: STATUS.PENDING })
  }

  @query
  processing = () => {
    return this.collection.find({ status: STATUS.PROCESSING })
  }

  @query
  finished = () => {
    return this.collection.find({ status: STATUS.FINISHED })
  }

  @query
  failed = () => {
    return this.collection.find({ status: STATUS.FAILED })
  }
}

const JobInstance = new JobModel()
window.Job = JobInstance

export default JobInstance
