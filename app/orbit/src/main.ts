import { findContiguousPorts } from './findContiguousPorts'
import { setConfig } from '@mcro/config'

type OrbitOpts = {
  version: string
}

export async function main({ version }: OrbitOpts) {
  const ports = await findContiguousPorts(5, 3333)
  setConfig({
    version,
    ports: {
      server: ports[0],
      bridge: ports[1],
      swift: ports[2],
      dbBridge: ports[3],
      oracleBridge: ports[4],
    },
  })

  // require apps after config
  const ElectronApp = require('@mcro/orbit-electron')
  ElectronApp.main({ port: ports[0] })
}
