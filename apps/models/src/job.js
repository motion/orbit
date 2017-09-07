// @flow
import global from 'global'
import { Model, object, str, number } from '@mcro/model'

export const STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  COMPLETED: 2,
  FAILED: 3,
}

export const methods = {}

export class JobModel extends Model {
  type: string
  action: ?string
  info: ?Object
  percent: number
  tries: number
  status: number
  lastError: ?Object
  createdAt: string
  updatedAt: string

  static props = {
    type: str,
    action: str.optional,
    info: object.optional,
    percent: number,
    tries: number,
    status: number,
    lastError: object.optional,
    timestamps: true,
  }

  static defaultProps = {
    percent: 0,
    tries: 0,
    status: 0,
  }

  settings = {
    database: 'jobs',
  }

  status = STATUS
  hooks = {}
  methods = methods

  pending = (opt?: Object) =>
    this.collection.find({ status: STATUS.PENDING, ...opt })
  processing = (opt?: Object) =>
    this.collection.find({ status: STATUS.PROCESSING, ...opt })
  completed = (opt?: Object) =>
    this.collection.find({ status: STATUS.COMPLETED, ...opt })
  failed = (opt?: Object) =>
    this.collection.find({ status: STATUS.FAILED, ...opt })

  lastCompleted = (opt?: Object) =>
    this.collection
      .findOne({ status: STATUS.COMPLETED, ...opt })
      .sort({ updatedAt: 'desc' })

  lastPending = (opt?: Object) =>
    this.collection
      .findOne({ status: STATUS.PENDING, ...opt })
      .sort({ updatedAt: 'desc' })
}

const JobInstance = new JobModel()
global.Job = JobInstance

export default JobInstance
