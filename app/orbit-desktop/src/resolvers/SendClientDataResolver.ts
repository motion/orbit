import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { SendClientDataCommand } from '@o/models'
import root from 'global'
import { OrbitDesktopRoot } from '../OrbitDesktopRoot'

const log = new Logger('command:send-client-data')

export const SendClientDataResolver = resolveCommand(
  SendClientDataCommand,
  async ({ name, value }) => {
    log.info(`send data...`, { name, value })
    const mediatorServer = (root.Root as OrbitDesktopRoot).mediatorServer
    for (let id of mediatorServer.dataIds) {
      mediatorServer.options.transport.send({
        id,
        notFound: false,
        result: {
          name,
          value,
        },
      })
    }
  },
)
