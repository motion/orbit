import { GlobalConfig } from '@o/config'
import { app } from 'electron'
import * as Path from 'path'
import { findContiguousPorts } from './helpers/findContiguousPorts'
import execa = require('execa')

export async function getInitialConfig({ appEntry }: { appEntry: string }): Promise<GlobalConfig> {
  const isProd = process.env.NODE_ENV !== 'development'

  // find a bunch of ports for us to use
  const ports = await findContiguousPorts(14, isProd ? 3333 : 3001)

  // for electron we use ports dynamically - each new app window consumes a port from this pool
  // todo: probably 14 is small number, we need to specify optimal number of ports we are going to use
  const electronPorts = await findContiguousPorts(14, isProd ? 4444 : 4001)
  let config: GlobalConfig

  if (!ports || !electronPorts) {
    throw new Error('no ports found!')
  }

  const desktopRoot = Path.join(require.resolve('@o/orbit-desktop'), '..', '..')
  const appStatic = Path.join(require.resolve('@o/orbit-app'), '..', 'dist')
  const nodeBinary = isProd ? app.getPath('exe') : (await execa('which', ['node'])).stdout
  const dotApp = Path.join(__dirname, '..', '..', '..', '..', '..')
  const userData = app.getPath('userData')
  const [
    server,
    bridge,
    swift,
    mediator,
    desktopMediator,
    syncersMediator,
    screenBridge,
    ocrBridge,
    auth,
    authProxy,
    ...apps
  ] = ports

  config = {
    isProd,
    paths: {
      appEntry,
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
      electronMediators: electronPorts,
    },
  }

  return config
}
