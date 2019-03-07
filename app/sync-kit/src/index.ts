import { MediatorClient } from '@o/mediator'
import { AppBit } from '@o/models'
import { EntityManager } from 'typeorm'

export * from './AppSyncer'
export * from './BitUtils'
export * from './SyncerUtils'

let entityManager: EntityManager
export function getEntityManager() {
  return entityManager
}
export function setEntityManager(manager: EntityManager) {
  entityManager = manager
}

let mediatorClient: MediatorClient
export function getMediatorClient() {
  return mediatorClient
}
export function setMediatorClient(mediator: MediatorClient) {
  mediatorClient = mediator
}

export let isAborted: (app: AppBit) => any
export function setAbortionLogic(onAbort: (app: AppBit) => any) {
  isAborted = onAbort
}
