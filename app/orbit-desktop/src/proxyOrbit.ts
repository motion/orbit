import hostile_ from 'hostile'
import { promisifyAll } from 'sb-promisify'
import forwardPort from 'http-port-forward'
import killPort from 'kill-port'
import { sleep } from './helpers'

const findArgVal = arg => process.argv[process.argv.indexOf(arg) + 1]
const host = findArgVal('--host')
const port = findArgVal('--port')
const hostile = promisifyAll(hostile_)

if (!host || !port) {
  console.log(`No host or port. host: ${host} port: ${port}`)
} else {
  async function proxyOrbit() {
    console.log('Proxying', host, port, 'to orbit')

    // modify /etc/hosts
    const lines = await hostile.get(true)
    const exists = lines.map(line => line[1]).indexOf(host) > -1
    if (!exists) {
      console.log('setting up hosts')
      hostile.set('127.0.0.1', host)
    } else {
      console.log('exists already', exists)
    }

    // attempt to kill port 80 just in case...
    try {
      await killPort(80)
    } catch (err) {
      console.log('err killing port', err.message)
    }

    // forward port
    forwardPort(port, 80, { isPublicAccess: true })
  }

  // run
  proxyOrbit()
}
