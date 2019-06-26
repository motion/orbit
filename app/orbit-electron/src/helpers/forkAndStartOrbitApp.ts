import { forkProcess } from '@o/orbit-fork-process'

import { addAppProcess } from '../resolver/CloseAppResolver'

const lastUsedInspectPort = 9003

export function forkAndStartOrbitApp({ appId }: { appId: number }, environmentVariables = null) {
  if (typeof appId !== 'number') {
    throw new Error('No appId given')
  }

  let proc = forkProcess({
    name: `orbit-app-${appId}`,
    env: {
      ...environmentVariables,
      APP_ID: appId,
    },
    inspectPort: lastUsedInspectPort + appId,
    inspectPortRemote: lastUsedInspectPort + appId + 1,
  })

  addAppProcess({
    appId,
    process: proc,
  })
}
