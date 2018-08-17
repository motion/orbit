import { logger } from '@mcro/logger'
import { cancel } from './cancel'

const log = logger('automagical')

export const ensure = (message: string, condition: boolean) => {
  if (!condition) {
    log(`Reaction cancelled: ${message}`)
    throw cancel
  }
}
