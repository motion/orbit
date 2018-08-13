import { IntegrationType } from './IntegrationType'

export interface Job {

  /**
   * Target type.
   */
  target: "job"

  /**
   * Job id.
   */
  id: number

  /**
   * Syncer name that run this job.
   */
  syncer: string

  /**
   * Integration type.
   */
  integration: IntegrationType

  /**
   * Time when job was executed.
   */
  time: number

  /**
   * Execution status.
   */
  status: string

  /**
   * Execution message.
   */
  message: string

}

