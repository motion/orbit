import { forkProcess } from '@o/orbit-fork-process'
import { AppInstanceConf, ORBIT_APP_STARTUP_CONFIG } from '@o/stores'

import { appProcesses } from '../orbit/OrbitMainWindow'

export function forkAndStartOrbitApp({ appId }: { appId: number }) {
  console.log('forkAndStartOrbitApp', appId)

  if (typeof appId !== 'number') {
    throw new Error('No appId given')
  }

  let proc = forkProcess({
    name: `orbit-app-${appId}`,
    env: {
      [ORBIT_APP_STARTUP_CONFIG]: JSON.stringify({
        appId,
        bundleURL: `/appServer/bundle.js`,
      } as AppInstanceConf),
    },
    // TODO if we want to attach repl, increment for each new orbit sub-process, need a counter here
    // inspectPort: 9006,
    // inspectPortRemote: 9007,
  })

  appProcesses.push({ appId, process: proc })
}
