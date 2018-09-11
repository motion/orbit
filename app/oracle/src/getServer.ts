import killPort from 'kill-port'
import { Server } from 'ws'

let server

export async function getServer() {
  if (!server) {
    // kill old ones
    await killPort(this.props.port)
    server = new Server({ port: this.props.port })
    server.on('error', (...args) => {
      console.log('server error', args)
    })
  }
  return server
}
