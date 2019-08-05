import { Logger } from '@o/logger'
import { forkProcess } from '@o/orbit-fork-process'

import { addAppProcess } from '../resolver/CloseAppResolver'

const log = new Logger('forkAndStartOrbitApp')
const lastUsedInspectPort = 9003

/**
 * TODO theres some duplication here with startChildProcess
 */

export function forkAndStartOrbitApp(
  { windowId }: { windowId: number },
  environmentVariables = null,
) {
  if (typeof windowId !== 'number') {
    throw new Error('No windowId given')
  }
  const inspectPort = lastUsedInspectPort + windowId
  const inspectPortRemote = lastUsedInspectPort + windowId + 1
  log.info(`inspectPorts`, inspectPort, inspectPortRemote)

  let proc = forkProcess({
    name: `orbit-app-${windowId}`,
    env: {
      ORBIT_CONFIG: process.env.ORBIT_CONFIG,
      _: process.env._,
      HOME: process.env.HOME,
      LOG_LEVEL: process.env.LOG_LEVEL,
      STACK_FILTER: process.env.STACK_FILTER,
      NODE_ENV: process.env.NODE_ENV,
      SINGLE_USE_MODE: process.env.SINGLE_USE_MODE,
      ...environmentVariables,
      WINDOW_ID: windowId,
    },
    inspectPort,
    inspectPortRemote,
  })

  addAppProcess({
    windowId,
    process: proc,
  })
}
