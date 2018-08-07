import { IntegrationType } from '@mcro/models'
import { SettingEntity } from '../../entities/SettingEntity'

/**
 * Interface for integration syncers.
 */
export interface IntegrationSyncer {

  /**
   * Runs sync process of the integration.
   */
  run(): Promise<void>

  /**
   * Resets all the synchronization data.
   * Useful when its necessary to run syncer from scratch.
   */
  reset(): Promise<void>

}

/**
 * Options to be passed to Syncer.
 */
export interface SyncerOptions {
  /**
   * Integration type.
   * Used to get syncer settings.
   */
  type: IntegrationType

  /**
   * Constructor of the integration syncer instance.
   */
  constructor: new (setting: SettingEntity) => IntegrationSyncer

  /**
   * Interval during which syncers should be executed.
   */
  interval: number
}
