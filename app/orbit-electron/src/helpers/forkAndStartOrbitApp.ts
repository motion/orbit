import { forkProcess } from '@o/orbit-fork-process'
import { ORBIT_APP_STARTUP_CONFIG, AppInDev, AppStartupConfig } from '@o/stores'
import { appProcesses } from '../orbit/OrbitWindow'

export default function forkAndStartOrbitApp({
  appId,
  appInDev,
}: {
  appId: number
  appInDev?: AppInDev
}) {
  let appStartupConfig: AppStartupConfig = {
    appId,
    appInDev,
  }
  let env = {
    [ORBIT_APP_STARTUP_CONFIG]: JSON.stringify(appStartupConfig),
  }
  let proc = forkProcess({
    name: 'orbit',
    env,
    // TODO we can increment for each new orbit sub-process, need a counter here
    // inspectPort: 9006,
    // inspectPortRemote: 9007,
  })

  appProcesses.push({ appId, process: proc })
}
