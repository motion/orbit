import { Logger } from '@mcro/logger'
import { ReactionRejectionError } from './constants'

const log = new Logger('automagical')

export const ensure = (message: string, condition: boolean) => {
  if (!condition) {
    // TODO we can make this throw a custom error type and catch it in automagic
    // that would let us log out the parent react name along with message
    if (process.env.DEBUG === 'automagical') {
      log.info(`Reaction cancelled: ${message}`)
    }
    throw new ReactionRejectionError(message)
  }
}
