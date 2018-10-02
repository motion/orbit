import { SyncerConstructor } from './IntegrationSyncer'
import { Syncer } from './Syncer'
import { Syncers } from './Syncers'

/**
 * Finds a Syncer with a given class.
 */
export function findSyncer(constructor: SyncerConstructor) {
  return Syncers.find(syncer => {
    if (syncer instanceof Syncer) {
      return syncer.options.constructor === constructor
    }

    return false
  })
}