import killPort from 'kill-port'
import { Server } from 'ws'

let server

export async function getServer(port: number) {
  if (!server) {
    // kill old ones
    await killPort(port)
    server = new Server({ port })
    server.on('error', (...args) => {
      console.log('server error', args)
    })
  }
  return server
}
