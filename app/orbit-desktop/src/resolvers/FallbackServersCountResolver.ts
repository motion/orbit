import { MediatorServer, resolveCommand } from '@mcro/mediator'
import { FallbackServersCountCommand } from '@mcro/models'
import root from 'global'

// const log = new Logger('command:fallback-servers-count')

export const FallbackServersCountResolver = resolveCommand(FallbackServersCountCommand, () => {
  return (root.mediatorServer as MediatorServer).options.fallbackClient.options.transports.length
})
