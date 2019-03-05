import { EntityManager } from 'typeorm'
import { MediatorClient } from '@mcro/mediator'
import { AppBit } from '@mcro/models'

export * from './AppSyncer'
export * from './SyncerUtils'
export * from './BitUtils'

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