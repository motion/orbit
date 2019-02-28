import { AppIdentifier, BaseAppBit } from '@mcro/models'
import { Logger } from '@mcro/logger'
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
  appIdentifier?: AppIdentifier

  /**
   * Syncer runner.
   */
  runner: SyncerRunner<any>

  /**
   * Interval during which syncers should be executed.
   */
  interval: number
}

/**
 * Options passed to the syncer runner.
 */
export type CreateSyncerOptions<AppType = BaseAppBit> = {

  /**
   * App bit.
   */
  app: AppType

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
  isAborted: () => Promise<boolean>

  /**
   * Set of utils help write custom syncers.
   */
  utils: SyncerUtils

}

/**
 * Function that executes syncer.
 */
export type SyncerRunner<T> = (options: CreateSyncerOptions<T>) => any

/**
 * Helper factory function that helps to create syncer in easy type-safe manner.
 */
export const createSyncer = <T>(runner: SyncerRunner<T>): SyncerRunner<T> => runner

