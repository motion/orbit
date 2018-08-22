import { store, react } from '@mcro/black'
import { App } from '@mcro/stores'
import { getConfig } from '../config'
import { logger } from '@mcro/logger'
import Sudoer from 'electron-sudo'
import * as Path from 'path'

const log = logger('desktop')
const Config = getConfig()
const options = { name: 'Orbit Proxy' }
const sudoer = new Sudoer(options)

// @ts-ignore
@store
export class PortForwardStore {
  isForwarded = false

  forwardOnAccept = react(
    () => App.state.acceptsForwarding,
    accepts => {
      react.ensure('accepts', accepts)
      react.ensure('not forwarded', !this.isForwarded)
      log('Starting orbit proxy...')
      this.forwardPort()
    },
  )

  forwardPort = async () => {
    const pathToOrbitProxy = Path.join(__dirname, '..', 'proxyOrbit.js')
    const proc = await sudoer.spawn('node', [pathToOrbitProxy], {
      env: {
        HOST: Config.server.host,
        PORT: Config.server.port,
      },
    })
    log('Launched orbit Proxy')
    proc.output.stdout.on('data', data => {
      console.log(`${data}`)
    })
  }
}
