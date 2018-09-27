import { Setting } from './Setting'

export interface Job {

  /**
   * Target type.
   */
  target: "job"

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
  settingId?: number

  /**
   * Integration for which this job was executed.
   */
  setting?: Setting

  /**
   * Time when job was executed.
   */
  time?: number

  /**
   * Execution status.
   */
  status?: string

  /**
   * Execution message.
   */
  message?: string

}

