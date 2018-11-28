import { Logger } from '@mcro/logger'
import * as Path from 'path'
import { getGlobalConfig } from '@mcro/config'
import Sudoer from '@mcro/electron-sudo'
import { checkAuthProxy } from './checkAuthProxy'

const log = new Logger('desktop')
const Config = getGlobalConfig()

export function startAuthProxy() {
  const pathToOrbitProxy = Path.join(__dirname, '..', 'proxyOrbit.js')
  const port = Config.ports.server
  const host = Config.urls.authHost
  const sudoer = new Sudoer({ name: 'Orbit Private Proxy' })
  const args = `${pathToOrbitProxy} --host ${host}:${port} --host go:${port} --host hi:${port} --host orbit:${port}`.split(
    ' ',
  )
  const env = {
    ...process.env,
    ELECTRON_RUN_AS_NODE: 1,
  }

  log.info(`Running proxy script: ${pathToOrbitProxy}`)

  // run proxy server in secure sub-process
  sudoer
    .spawn(Config.paths.nodeBinary, args, {
      env,
    })
    .then(proc => {
      proc.stdout.on('data', x => log.info(`OrbitProxy: ${x}`))
      proc.stderr.on('data', x => log.info(`OrbitProxyErr: ${x}`))
    })

  return new Promise<boolean>(resolve => {
    let failTimeout
    let checkInterval

    const checkAndFinish = async () => {
      if (await checkAuthProxy()) {
        clearTimeout(failTimeout)
        clearInterval(checkInterval)
        resolve(true)
      }
    }

    // fail after a bit
    failTimeout = setTimeout(() => {
      log.info('timed out setting up proxy')
      resolve(false)
    }, 8000)
    checkInterval = setInterval(checkAndFinish, 100)
    checkAndFinish()
  })
}
