import { findContiguousPorts } from './findContiguousPorts'
import { setGlobalConfig } from '@mcro/config'
import killPort from 'kill-port'
import { cleanupChildren } from './cleanupChildren'
import * as Path from 'path'
// @ts-ignore
import { app } from 'electron'

type OrbitOpts = {
  version: string
}

export async function main({ version }: OrbitOpts) {
  let desktopPid

  const handleExit = async () => {
    console.log('Orbit exiting...')
    if (desktopPid) {
      process.kill(desktopPid)
    }
    console.log('Cleaning children...')
    await cleanupChildren()
    console.log('bye!')
  }

  // handle exits gracefully
  process.on('exit', handleExit)

  const ports = await findContiguousPorts(5, 3333)

  if (!ports) {
    console.log('no ports found!')
    return
  }

  // for some reason you'll get "directv-tick" consistently on a port
  // even though that port was found to be empty....
  // so attempting to make sure we kill anything even if it looks empty
  try {
    console.log('Found ports, ensuring clear', ports)
    await Promise.all(ports.map(port => killPort(port)))
  } catch {
    // errors are just showing the ports are empty
  }

  const rootDirectory = Path.join(__dirname, '..', '..', '..', '..')
  console.log('rootDirectory', rootDirectory)

  console.log(`\n\n\n\n\n\n ${app.getAppPath()} .... ${app.getPath('exe')}`)

  setGlobalConfig({
    userDataDirectory: app.getPath('appData'),
    rootDirectory,
    privateUrl: 'http://private.tryorbit.com',
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
  desktopPid = await ElectronApp.main({ port: ports[0], handleExit })
}
