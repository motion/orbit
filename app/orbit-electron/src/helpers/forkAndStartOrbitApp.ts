import { forkProcess } from '@o/orbit-fork-process'
import { AppInDev, AppStartupConfig, ORBIT_APP_STARTUP_CONFIG } from '@o/stores'

import { appProcesses } from '../orbit/OrbitMainWindow'

export function forkAndStartOrbitApp({ appId, appInDev }: { appId: number; appInDev?: AppInDev }) {
  let appStartupConfig: AppStartupConfig = {
    appId,
    appInDev,
  }
  let env = {
    [ORBIT_APP_STARTUP_CONFIG]: JSON.stringify(appStartupConfig),
  }
  let proc = forkProcess({
    name: `orbit-app-${appId}`,
    env,
    // TODO we can increment for each new orbit sub-process, need a counter here
    // inspectPort: 9006,
    // inspectPortRemote: 9007,
  })

  appProcesses.push({ appId, process: proc })
}
