import { Setting, IntegrationType } from '@mcro/models'

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
  constructor: new (setting: Setting) => IntegrationSyncer

  /**
   * Interval during which syncers should be executed.
   */
  interval: number

}