import { Logger } from '@mcro/logger'
import { AppBit, AppBitType } from '@mcro/models'

/**
 * Interface for Source syncers.
 */
export interface AppSyncer {
  /**
   * Runs sync process of the Source.
   */
  run(): Promise<void>
}

/**
 * Constructor of the Source syncer instance.
 */
export type SyncerConstructor = new (setting?: AppBit, log?: Logger) => AppSyncer

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
   * Source type.
   * Used to get syncer settings.
   * If type is not specified then syncer will be executed once without any setting specified.
   */
  type?: AppBitType

  /**
   * Constructor of the Source syncer instance.
   */
  constructor: SyncerConstructor

  /**
   * Interval during which syncers should be executed.
   */
  interval: number
}
