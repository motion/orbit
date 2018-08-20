import { logger } from '@mcro/logger'
import { cancel } from './cancel'

const log = logger('automagical')

export const ensure = (message: string, condition: boolean) => {
  if (!condition) {
    // TODO we can make this throw a custom error type and catch it in automagic
    // that would let us log out the parent react name along with message
    log(`Reaction cancelled: ${message}`)
    throw cancel
  }
}
