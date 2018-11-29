import { Logger } from '@mcro/logger'
import * as Path from 'path'
import { getGlobalConfig } from '@mcro/config'
import Sudoer from '@mcro/electron-sudo'
import { checkAuthProxy } from './checkAuthProxy'
import { existsSync } from 'fs'

const log = new Logger('startAuthProxy')
const Config = getGlobalConfig()

export function startAuthProxy() {
  const authProxyScript = Path.join(__dirname, 'authProxyProcess.js')
  if (!existsSync(authProxyScript)) {
    throw new Error('Proxy script not valid path')
  }
  const host = Config.urls.authHost
  const port = Config.ports.authProxy
  const sudoer = new Sudoer({ name: 'Orbit Private Proxy' })
  const command = `${authProxyScript} --authUrl=${host}:${port} --proxyTo=${Config.ports.auth}`
  const env = {
    ...process.env,
    ELECTRON_RUN_AS_NODE: 1,
  }

  log.info(`Running proxy script: ${command}`)

  return new Promise<boolean>(resolve => {
    // run proxy server in secure sub-process
    sudoer
      .spawn(Config.paths.nodeBinary, command.split(' '), {
        env,
      })
      .then(proc => {
        proc.stdout.on('data', x => log.info(`OrbitProxy: ${x}`))
        proc.stderr.on('data', x => log.info(`OrbitProxyErr: ${x}`))
      })
      .catch(err => {
        log.error('error spawning', err)
        resolve(false)
      })

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
