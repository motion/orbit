import hostile_ from 'hostile'
import { promisifyAll } from 'sb-promisify'
import forwardPort from 'http-port-forward'

const host = process.env.HOST
const port = process.env.PORT
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
      hostile.set('127.0.0.1', 'private.tryorbit.com')
    }

    // forward port
    forwardPort(80, port)
  }

  // run
  proxyOrbit()
}
