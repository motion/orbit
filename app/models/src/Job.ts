import { AppBit } from './AppBit'
import { JobStatus } from './JobStatus'
import { JobType } from './JobType'

export interface Job {
  /**
   * Target type.
   */
  target: 'job'

  /**
   * Job id.
   */
  id?: number

  /**
   * Syncer name that run this job.
   */
  syncer?: string

  /**
   * App id for which this job was executed.
   */
  appId?: number

  /**
   * Source for which this job was executed.
   */
  app?: AppBit

  /**
   * Time when job was executed.
   */
  time?: number

  /**
   * Job operation type.
   */
  type?: JobType

  /**
   * Execution status.
   */
  status?: JobStatus

  /**
   * Execution message.
   */
  message?: string
}
