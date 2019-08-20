import { StatusReply } from '@o/models'

import { reporter } from './reporter'

export function logStatusReply(reply?: StatusReply<any>) {
  if (!reply) {
    reporter.verbose('no reply')
    return
  }
  if (reply.type === 'success') {
    reporter.success(reply.message, reply.value)
  } else if (reply.type === 'error') {
    reporter.error(reply.message, reply.errors ? reply.errors[0] : undefined)
  } else {
    reporter.info(`reply? ${reply}`)
  }
}
