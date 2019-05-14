import { forkProcess } from '@o/orbit-fork-process'

import { appProcesses } from '../orbit/OrbitMainWindow'

export function forkAndStartOrbitApp({ appId }: { appId: number }) {
  if (typeof appId !== 'number') {
    throw new Error('No appId given')
  }

  let proc = forkProcess({
    name: `orbit-app-${appId}`,
    env: {
      APP_ID: appId,
    },
    // TODO if we want to attach repl, increment for each new orbit sub-process, need a counter here
    // inspectPort: 9006,
    // inspectPortRemote: 9007,
  })

  appProcesses.push({ appId, process: proc })
}
