import { Logger } from '@o/logger'
import { forkProcess } from '@o/orbit-fork-process'

import { addAppProcess } from '../resolver/CloseAppResolver'

const log = new Logger('forkAndStartOrbitApp')
const lastUsedInspectPort = 9003

/**
 * TODO theres some duplication here with startChildProcess
 */

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
      ORBIT_CONFIG: process.env.ORBIT_CONFIG,
      _: process.env._,
      HOME: process.env.HOME,
      LOG_LEVEL: process.env.LOG_LEVEL,
      STACK_FILTER: process.env.STACK_FILTER,
      NODE_ENV: process.env.NODE_ENV,
      SINGLE_USE_MODE: process.env.SINGLE_USE_MODE,
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
