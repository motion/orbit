import { GlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { app } from 'electron'
import execa from 'execa'
import { last } from 'lodash'
import * as Path from 'path'

import { findContiguousPorts } from './helpers/findContiguousPorts'

const log = new Logger('getInitialConfig')

export async function getInitialConfig({
  appEntry,
  cli,
}: {
  appEntry: string
  cli: string
}): Promise<GlobalConfig> {
  const isProd = process.env.NODE_ENV !== 'development'
  log.verbose(`Get config isProd ${isProd}`)

  // find a bunch of ports for us to use
  const ports = await findContiguousPorts(20, 3001)

  if (ports === false) {
    throw log.panic(`No ports found!`)
  }

  // for electron we use ports dynamically - each new app window consumes a port from this pool
  // todo: could allocate more or just add more as we need
  const electronPorts = await findContiguousPorts(20, last(ports))
  let config: GlobalConfig

  if (!ports || !electronPorts) {
    throw new Error('no ports found!')
  }

  const desktopRoot = Path.join(require.resolve('@o/orbit-desktop'), '..', '..')
  const appStatic = Path.join(require.resolve('@o/orbit-app'), '..', 'dist')
  const nodeBinary = isProd ? app.getPath('exe') : (await execa('which', ['node'])).stdout
  const dotApp = Path.join(__dirname, '..', '..', '..', '..', '..')
  const userData = app.getPath('userData')
  const desktop = app.getPath('desktop')
  const [
    server,
    bridge,
    swift,
    mediator,
    desktopMediator,
    workersMediator,
    screenBridge,
    ocrBridge,
    auth,
    authProxy,
    graphServer,
    ...apps
  ] = ports

  config = {
    isProd,
    paths: {
      cli,
      appEntry,
      orbitConfig: Path.join(userData, 'orbit.json'),
      desktopRoot,
      appStatic,
      userData,
      nodeBinary,
      resources: Path.join(app.getAppPath(), '..'),
      dotApp,
      desktop,
    },
    urls: {
      auth: 'https://orbitauth.com',
      authHost: 'orbitauth.com',
      server: `http://localhost:${ports[0]}`,
      serverHost: 'localhost',
    },
    version: process.env.ORBIT_VERSION,
    ports: {
      graphServer,
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
      workersMediator,
      electronMediators: electronPorts,
    },
  }

  return config
}
