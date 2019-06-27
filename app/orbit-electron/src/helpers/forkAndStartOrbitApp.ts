import { forkProcess } from '@o/orbit-fork-process'

import { addAppProcess } from '../resolver/CloseAppResolver'
import { Logger } from '@o/logger'

const log = new Logger('forkAndStartOrbitApp')
const lastUsedInspectPort = 9003

export function forkAndStartOrbitApp({ appId }: { appId: number }, environmentVariables = null) {
  if (typeof appId !== 'number') {
    throw new Error('No appId given')
  }

  const inspectPort = lastUsedInspectPort + appId
  const inspectPortRemote = lastUsedInspectPort + appId + 1

  log.info(`inpsectPort`, inspectPort, inspectPortRemote)

  let proc = forkProcess({
    name: `orbit-app-${appId}`,
    env: {
      ...environmentVariables,
      APP_ID: appId,
    },
    inspectPort,
    inspectPortRemote,
  })

  addAppProcess({
    appId,
    process: proc,
  })
}
