import { Logger } from '@mcro/logger'
import { IntegrationType, Setting } from '@mcro/models'

/**
 * Interface for integration syncers.
 */
export interface IntegrationSyncer {

  /**
   * Runs sync process of the integration.
   */
  run(): Promise<void>

}

/**
 * Constructor of the integration syncer instance.
 */
export type SyncerConstructor = new (setting?: Setting, log?: Logger) => IntegrationSyncer

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
   * Integration type.
   * Used to get syncer settings.
   * If type is not specified then syncer will be executed once without any setting specified.
   */
  type?: IntegrationType

  /**
   * Constructor of the integration syncer instance.
   */
  constructor: SyncerConstructor

  /**
   * Interval during which syncers should be executed.
   */
  interval: number
}
