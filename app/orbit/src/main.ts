import { findContiguousPorts } from './findContiguousPorts'
import { setConfig } from '@mcro/config'
import killPort from 'kill-port'

type OrbitOpts = {
  version: string
}

export async function main({ version }: OrbitOpts) {
  const ports = await findContiguousPorts(5, 3333)

  if (!ports) {
    console.log('no ports found!')
    return
  }

  // for some reason you'll get "directv-tick" consistently on a port
  // even though that port was found to be empty....
  // so attempting to make sure we kill anything even if it looks empty
  await Promise.all(ports.map(port => killPort(port)))

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
