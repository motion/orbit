import { IntegrationType } from '@mcro/models'
import { SettingEntity } from '@mcro/entities'

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
export type SyncerConstructor = new (setting?: SettingEntity) => IntegrationSyncer

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
