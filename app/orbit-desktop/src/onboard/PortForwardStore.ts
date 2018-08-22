import { store, react, ensure } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { getConfig } from '../config'
import { logger } from '@mcro/logger'
// import Sudoer from 'electron-sudo'
import sudoPrompt from 'sudo-prompt'
import * as Path from 'path'
import { getConfig as getGlobalConfig } from '@mcro/config'

const log = logger('desktop')
const Config = getConfig()
const options = { name: 'Orbit Proxy' }

// @ts-ignore
@store
export class PortForwardStore {
  isForwarded = false

  forwardOnAccept = react(
    () => App.state.acceptsForwarding,
    accepts => {
      ensure('accepts', accepts)
      ensure('not forwarded', !this.isForwarded)
      log('Starting orbit proxy...')
      this.forwardPort()
    },
  )

  forwardPort = async () => {
    const pathToOrbitProxy = Path.join(__dirname, '..', 'proxyOrbit.js')
    log(`Running proxy script: ${pathToOrbitProxy}`)

    const { port } = Config.server
    const GlobalConfig = getGlobalConfig()
    const host = GlobalConfig.privateUrl.replace('http://', '')

    sudoPrompt.exec(
      `node ${pathToOrbitProxy} --port ${port} --host ${host}`,
      options,
      (err, stdout, stderr) => {
        if (err) {
          const message = `${err.message}`
          if (message.indexOf('EADDRINUSE')) {
            // handle error!
            log('OrbitProxy in use error', message)
            // TODO: we can run lsof or similar and show what app is using it and show instructions.
            // they only need to forward during oauth so we could tell them its temporary too.
            Desktop.sendMessage(
              App,
              App.messages.FORWARD_STATUS,
              'Port already in use: 80',
            )
          } else {
            // handle error!
            log('OrbitProxy', err)
            Desktop.sendMessage(
              App,
              App.messages.FORWARD_STATUS,
              message.slice(0, 400),
            )
          }
        } else {
          log('OrbitProxy', stdout, stderr)
        }
      },
    )

    // const sudoer = new Sudoer(options)
    // const proc = await sudoer.spawn('node', [pathToOrbitProxy], {
    //   env: {
    //     HOST: host,
    //     PORT: port,
    //   },
    // })
    // this.handleProcess(proc)

    log('Launched orbit Proxy')
  }

  private handleProcess = proc => {
    proc.stdout.on('data', data => {
      log(`OrbitProxyProcess: ${data}`)
    })
    proc.stderr.on('data', data => {
      log(`OrbitProxyProcess: ${data}`)
    })
  }
}
