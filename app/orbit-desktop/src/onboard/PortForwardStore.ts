import { store, react } from '@mcro/black'
import forwardPort from 'http-port-forward'
import { App } from '@mcro/stores'
import hostile_ from 'hostile'
import { getConfig } from '../config'
import { promisifyAll } from 'sb-promisify'
import sudoPrompt_ from 'sudo-prompt'
import { logger } from '@mcro/logger'

const log = logger('desktop')
const hostile = promisifyAll(hostile_)
const sudoPrompt = promisifyAll(sudoPrompt_)
const Config = getConfig()

// @ts-ignore
@store
export class PortForwardStore {
  isForwarded = false

  forwardOnAccept = react(
    () => App.state.acceptsForwarding,
    accepts => {
      react.ensure('accepts', accepts)
      react.ensure('not forwarded', !this.isForwarded)
      this.forwardPort()
      this.setupHosts()
    },
  )

  forwardPort = () => {
    const port = Config.server.port
    forwardPort(80, port, { isPublicAccess: true })
  }

  setupHosts = async () => {
    const lines = await hostile.get(true)
    const exists = lines.map(line => line[1]).indexOf(Config.server.host) > -1
    if (!exists) {
      log('Adding host entry', Config.server.host)
      await sudoPrompt.exec(`npx hostile set 127.0.0.1 ${Config.server.host}`, {
        name: 'Orbit',
      })
    }
  }
}
