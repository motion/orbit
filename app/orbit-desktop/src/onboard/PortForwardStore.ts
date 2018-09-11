import { store, react, ensure } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { Logger } from '@mcro/logger'
import * as Path from 'path'
import { getGlobalConfig } from '@mcro/config'
import Sudoer from '@mcro/electron-sudo'

const log = new Logger('desktop')
const Config = getGlobalConfig()

const checkAuthProxy = () => {
  return new Promise(res => {
    const testUrl = `${Config.urls.authProxy}/hello`
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
      log.info('Starting orbit proxy...')
      clearInterval(this.successInt)
      this.forwardPort()
    },
  )

  forwardPort = async () => {
    const pathToOrbitProxy = Path.join(__dirname, '..', 'proxyOrbit.js')
    log.info(`Running proxy script: ${pathToOrbitProxy}`)

    const port = Config.ports.server
    const host = Config.urls.authProxy.replace('http://', '')

    // check in a loop since the sudoPrompt process is long running
    this.successInt = setInterval(async () => {
      if (await checkAuthProxy()) {
        clearInterval(this.successInt)
        Desktop.sendMessage(App, App.messages.FORWARD_STATUS, 'accepted')
      }
    }, 300)

    const sudoer = new Sudoer({ name: 'Orbit Private Proxy' })
    console.log('Electron binary path:', Config.paths.nodeBinary)
    const cmd = await sudoer.spawn(
      Config.paths.nodeBinary,
      `${pathToOrbitProxy} --port ${port} --host ${host}`.split(' '),
      {
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: 1,
        },
      },
    )
    cmd.stdout.on('data', x => {
      log.info(`OrbitProxy: ${x}`)
      if (x.indexOf('OrbitSuccess') > -1) {
        Desktop.sendMessage(App, App.messages.FORWARD_STATUS, 'success')
      }
    })
    cmd.stderr.on('data', x => {
      log.info(`OrbitProxyErr: ${x}`)
      Desktop.sendMessage(App, App.messages.FORWARD_STATUS, x)
    })
  }
}
