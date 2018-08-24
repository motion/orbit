import { store, react, ensure } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { getConfig } from '../config'
import { logger } from '@mcro/logger'
import sudoPrompt from 'sudo-prompt'
import * as Path from 'path'
import { getGlobalConfig } from '@mcro/config'
import Sudoer from '@mcro/electron-sudo'

const log = logger('desktop')
const Config = getConfig()

const checkAuthProxy = () => {
  return new Promise(res => {
    const testUrl = `${getGlobalConfig().privateUrl}/hello`
    // timeout
    const tm = setTimeout(() => res(false), 500)
    fetch(testUrl)
      .then(res => res.text())
      .then(text => {
        if (text === 'hello world') {
          clearTimeout(tm)
          res(true)
        }
      })
      .catch(err => {
        res(false)
      })
  })
}

// @ts-ignore
@store
export class PortForwardStore {
  isForwarded = false
  successInt = null

  forwardOnAccept = react(
    () => App.state.acceptsForwarding,
    accepts => {
      ensure('accepts', accepts)
      ensure('not forwarded', !this.isForwarded)
      log('Starting orbit proxy...')
      clearInterval(this.successInt)
      this.forwardPort()
    },
  )

  forwardPort = async () => {
    const pathToOrbitProxy = Path.join(__dirname, '..', 'proxyOrbit.js')
    log(`Running proxy script: ${pathToOrbitProxy}`)

    const { port } = Config.server
    const GlobalConfig = getGlobalConfig()
    const host = GlobalConfig.privateUrl.replace('http://', '')

    // check in a loop since the sudoPrompt process is long running
    this.successInt = setInterval(async () => {
      if (await checkAuthProxy()) {
        clearInterval(this.successInt)
        Desktop.sendMessage(App, App.messages.FORWARD_STATUS, 'accepted')
      }
    }, 300)

    const sudoer = new Sudoer({ name: 'Orbit Private Proxy' })
    let pathToElectronBinary = 'node'
    if (process.env.NODE_ENV !== 'development') {
      pathToElectronBinary = Path.join(
        GlobalConfig.rootDirectory,
        '..',
        '..',
        'MacOS',
        'Orbit',
      )
    }
    console.log('Electron binary path:', pathToElectronBinary)
    const cmd = await sudoer.spawn(
      pathToElectronBinary,
      `${pathToOrbitProxy} --port ${port} --host ${host}`.split(' '),
      {
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: 1,
        },
      },
    )
    cmd.stdout.on('data', x => {
      log(`OrbitProxy: ${x}`)
      if (x.indexOf('OrbitSuccess') > -1) {
        Desktop.sendMessage(App, App.messages.FORWARD_STATUS, 'success')
      }
    })
    cmd.stderr.on('data', x => {
      log(`OrbitProxyErr: ${x}`)
      Desktop.sendMessage(App, App.messages.FORWARD_STATUS, x)
    })
  }
}
