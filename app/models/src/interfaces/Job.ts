import { JobStatus } from './JobStatus'
import { JobType } from './JobType'
import { Source } from './Source'

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
   * Integration id for which this job was executed.
   */
  sourceId?: number

  /**
   * Integration for which this job was executed.
   */
  source?: Source

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
