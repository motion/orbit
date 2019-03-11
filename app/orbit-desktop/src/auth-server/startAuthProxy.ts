import { getGlobalConfig } from '@o/config'
import Sudoer from '@o/electron-sudo'
import { Logger } from '@o/logger'
import { existsSync } from 'fs'
import { userInfo } from 'os'
import * as Path from 'path'
import { checkAuthProxy } from './checkAuthProxy'

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
  const command = `${authProxyScript} --homeDir=${
    userInfo().homedir
  } --authUrl=${host}:${port} --proxyTo=${Config.ports.auth}`

  log.info(`Running proxy script: ${Config.paths.nodeBinary} ${command}`)

  return new Promise<boolean>(resolve => {
    let failTimeout
    let checkInterval

    function finish(success: boolean) {
      clearInterval(checkInterval)
      clearTimeout(failTimeout)
      resolve(success)
    }

    // run proxy server in secure sub-process
    sudoer
      .spawn(Config.paths.nodeBinary, command.split(' '), {
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: 1,
        },
      })
      .then(proc => {
        proc.stdout.on('data', x => console.log(`OrbitProxy: ${x}`))
        // DONT resolve or fail here, for some reason sometimes stdout comes as stderr
        // but thats fine, we have a fail timeout anyways...
        proc.stderr.on('data', x => console.log(`OrbitProxyErr: ${x}`))
      })
      .catch(err => {
        log.error('error spawning', err)
        finish(false)
      })

    const checkAndFinish = async () => {
      if (await checkAuthProxy()) {
        log.info('Successfully ran proxy')
        clearTimeout(failTimeout)
        clearInterval(checkInterval)
        finish(true)
      }
    }

    // fail after a bit
    failTimeout = setTimeout(() => {
      log.info('timed out setting up proxy')
      finish(false)
    }, 8000)
    checkInterval = setInterval(checkAndFinish, 100)
    checkAndFinish()
  })
}
