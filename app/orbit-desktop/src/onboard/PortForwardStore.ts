import { store, react, ensure } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { getConfig } from '../config'
import { logger } from '@mcro/logger'
import sudoPrompt from 'sudo-prompt'
import * as Path from 'path'
import { getConfig as getGlobalConfig } from '@mcro/config'

const log = logger('desktop')
const Config = getConfig()
const options = { name: 'Orbit Proxy' }

const checkAuthProxy = async () => {
  try {
    const testUrl = `${getGlobalConfig().privateUrl}/hello`
    console.log(`Checking testurl: ${testUrl}`)
    setTimeout(() => {
      throw new Error('timeout')
    }, 500)
    const res = await fetch(testUrl).then(res => res.text())
    if (res && res === 'hello world') {
      return true
    }
  } catch (err) {
    console.log('error seeing if already proxied')
  }
  return false
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

    // turns out it doesnt matter if theres a user just that we set it to something
    // see: https://github.com/jorangreef/sudo-prompt/blob/ad291f7bd00bba09a01b7e4ce93dfa547f35f22d/index.js#L172
    process.env.USER = process.env.USER || 'hi'

    sudoPrompt.exec(
      `node ${pathToOrbitProxy} --port ${port} --host ${host}`,
      options,
      (err, stdout, stderr) => {
        if (err) {
          const message = `${err.message}`
          if (message.indexOf('EADDRINUSE') > -1) {
            // handle error!
            log('OrbitProxy in use error', message)
            // TODO: we can run lsof or similar and show what app is using it and show instructions.
            // they only need to forward during oauth so we could tell them its temporary too.
            Desktop.sendMessage(
              App,
              App.messages.FORWARD_STATUS,
              'Port 80 already in use',
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
          log('OrbitProxy no err but exited early', stdout, stderr)
          Desktop.sendMessage(
            App,
            App.messages.FORWARD_STATUS,
            stdout || stderr,
          )
        }
      },
    )
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
