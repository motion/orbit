import hostile_ from 'hostile'
import { promisifyAll } from 'sb-promisify'
import forwardPort from 'http-port-forward'

const host = process.env.HOST
const port = process.env.PORT

if (!host || !port) {
  throw new Error(`No host or port. host: ${host} port: ${port}`)
}

const hostile = promisifyAll(hostile_)

export async function proxyOrbit() {
  console.log('Proxying', host, port, 'to orbit')

  // forward port
  forwardPort(80, port, { isPublicAccess: true })

  // modify /etc/hosts
  const lines = await hostile.get(true)
  const exists = lines.map(line => line[1]).indexOf(host) > -1
  if (!exists) {
    hostile.set('127.0.0.1', 'private.tryorbit.com')
  }
}
