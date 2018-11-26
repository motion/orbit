import { app } from 'electron'
import { findContiguousPorts } from './helpers/findContiguousPorts'
import killPort from 'kill-port'
import * as Path from 'path'
import { GlobalConfig } from '@mcro/config'

export async function getInitialConfig() {
  const isProd = process.env.NODE_ENV !== 'development'
  const ports = await findContiguousPorts(12, isProd ? 3333 : 3001)
  let config: GlobalConfig

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
  let nodeBinary = 'node'
  if (isProd) {
    nodeBinary = app.getPath('exe')
  }
  const dotApp = Path.join(__dirname, '..', '..', '..', '..', '..')
  const userData = app.getPath('userData')
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
      server: ports[0],
      bridge: ports[1],
      swift: ports[2],
      dbBridge: ports[3],
      oracleBridge: ports[4],
      mediator: ports[5],
      ocrBridge: ports[6],
      apps: ports.slice(7),
      auth: 4444
    },
  }

  return config
}

