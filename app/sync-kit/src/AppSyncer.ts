import { Logger } from '@o/logger'
import { AppBit } from '@o/models'
import { EntityManager } from 'typeorm'
import { SyncerUtils } from './SyncerUtils'

/**
 * Options to be passed to Syncer.
 */
export interface SyncerOptions {
  /**
   * Syncer name.
   * By default equals to implementation constructor name.
   */
  name?: string

  /**
   * App identifier.
   * Used to get syncer settings.
   * If type is not specified then syncer will be executed once without any setting specified.
   */
  appIdentifier?: string

  /**
   * Syncer runner.
   */
  runner: SyncerRunner

  /**
   * Interval during which syncers should be executed.
   */
  interval: number
}

/**
 * Options passed to the syncer runner.
 */
export type CreateSyncerOptions = {
  /**
   * App bit.
   */
  app: AppBit

  /**
   * Logger used to log syncer operations.
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
   * Set of utils help write custom syncers.
   */
  utils: SyncerUtils
}

/**
 * Function that executes syncer.
 */
export type SyncerRunner = (options: CreateSyncerOptions) => any

/**
 * Helper factory function that helps to create syncer in easy type-safe manner.
 */
export const createSyncer = (runner: SyncerRunner): SyncerRunner => runner
