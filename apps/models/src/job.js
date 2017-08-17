// @flow
import { Model, query, object, str, number } from '@mcro/model'

export const STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  COMPLETED: 2,
  FAILED: 3,
}

export const methods = {}

export type Job = typeof methods & {
  type: string,
  info?: Object,
  percent: number,
  tries: number,
  status: number,
  lastError?: string,
  createdAt?: string,
  updatedAt?: string,
}

export class JobModel extends Model {
  static props = {
    type: str,
    info: object.optional,
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

  status = STATUS

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
  completed = () => {
    return this.collection.find({ status: STATUS.COMPLETED })
  }

  @query
  failed = () => {
    return this.collection.find({ status: STATUS.FAILED })
  }
}

const JobInstance = new JobModel()
window.Job = JobInstance

export default JobInstance
