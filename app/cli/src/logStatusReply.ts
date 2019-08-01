import { reporter } from '@o/logger'
import { StatusReply } from '@o/models'

export function logStatusReply(reply?: StatusReply) {
  if (!reply) {
    reporter.verbose('no reply')
    return
  }
  if (reply.type === 'success') {
    reporter.info(reply.message)
  }
  if (reply.type === 'error') {
    reporter.error(reply.message, reply.errors ? reply.errors[0] : undefined)
  }
}
