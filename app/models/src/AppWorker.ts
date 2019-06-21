import { Logger } from '@o/logger'
import { EntityManager } from 'typeorm'

import { WorkerUtilsInstance } from './AppWorkerUtils'
import { AppBit } from './interfaces/AppBit'

/**
 * Helpers passed to the worker runner.
 */
export type WorkerHelpers = {
  /**
   * App bit.
   */
  app: AppBit

  /**
   * Logger used to log worker operations.
   */
  log: Logger

  /**
   * Database entity manager.
   */
  manager: EntityManager

  /**
   * Used to check if sync is aborted.
   */
  isAborted: () => Promise<void>

  /**
   * Set of utils help write custom workers.
   */
  utils: WorkerUtilsInstance
}

/**
 * Function that executes worker.
 */
export type AppWorker = (options: WorkerHelpers) => any

export type CreateAppWorker = <A extends AppWorker>(fn: A) => A
