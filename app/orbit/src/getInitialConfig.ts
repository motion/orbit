import { app } from 'electron'
import { findContiguousPorts } from './helpers/findContiguousPorts'
import killPort from 'kill-port'
import * as Path from 'path'
import { GlobalConfig } from '@mcro/config'
import execa = require('execa')

export async function getInitialConfig(): Promise<GlobalConfig> {
  const isProd = process.env.NODE_ENV !== 'development'

  // find a bunch of ports for us to use
  const ports = await findContiguousPorts(14, isProd ? 3333 : 3001)
  let config

  if (!ports) {
    throw new Error('no ports found!')
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

  const desktopRoot = Path.join(require.resolve('@mcro/orbit-desktop'), '..', '..')
  const appStatic = Path.join(require.resolve('@mcro/orbit-app'), '..', 'dist')
  const nodeBinary = isProd ? app.getPath('exe') : (await execa('which', ['node'])).stdout
  const dotApp = Path.join(__dirname, '..', '..', '..', '..', '..')
  const userData = app.getPath('userData')
  const [
    server,
    bridge,
    swift,
    desktopMediator,
    screenBridge,
    mediator,
    ocrBridge,
    auth,
    authProxy,
    syncersMediator,
    ...apps
  ] = ports

  config = {
    isProd,
    paths: {
      orbitConfig: Path.join(userData, 'orbit.json'),
      desktopRoot,
      appStatic,
      userData,
      nodeBinary,
      resources: Path.join(app.getAppPath(), '..'),
      dotApp,
    },
    urls: {
      auth: 'https://orbitauth.com',
      authHost: 'orbitauth.com',
      server: `http://localhost:${ports[0]}`,
      serverHost: 'localhost',
    },
    version: process.env.ORBIT_VERSION,
    ports: {
      server,
      bridge,
      swift,
      desktopMediator,
      screenBridge,
      mediator,
      ocrBridge,
      auth,
      authProxy,
      apps,
      syncersMediator,
    },
  }

  return config
}
