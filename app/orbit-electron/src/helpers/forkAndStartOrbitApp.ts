import { forkProcess } from '@o/orbit-fork-process'
import { appProcesses } from '../orbit/OrbitWindow'

export default function forkAndStartOrbitApp({appId}: {appId: number}) {
  const proc = forkProcess({
    name: 'orbit',
    // TODO we can increment for each new orbit sub-process, need a counter here
    // inspectPort: 9006,
    // inspectPortRemote: 9007,
  })

  appProcesses.push({ appId, process: proc })
}
