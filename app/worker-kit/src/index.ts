import { CreateAppWorker } from '@o/models'
import { setMediatorClient } from './mediatorClient'
import { cancelSyncer } from './Syncer'

export { sleep } from '@o/utils'
export * from '@o/logger'
export * from '@o/models'
export * from './BitUtils'
export * from './WorkerUtils'

export const createWorker: CreateAppWorker = fn => fn

export const __YOURE_FIRED_IF_YOU_EVEN_REPL_PEEK_AT_THIS = {
  setMediatorClient,
  cancelSyncer,
}
