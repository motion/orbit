import hostile_ from 'hostile'
import { promisifyAll } from 'sb-promisify'
import forwardPort from 'http-port-forward'

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

    // forward port
    forwardPort(80, port, { isPublicAccess: true })
  }

  // run
  proxyOrbit()
}
