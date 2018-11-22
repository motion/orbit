import { ensure, react, store } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'
import { certificateFor } from '@mcro/devcert'
import { Logger } from '@mcro/logger'
import { App, Desktop } from '@mcro/stores'
import * as https from 'https'
import express from 'express'
import { Server } from 'https'

/**
 * Runs https server that responses to oauth returned by integrations.
 */
export class HttpsAuthServer {
  private server: Server
  private log: Logger

  constructor() {
    this.log = new Logger('https-server')
  }

  /**
   * Checks if server is running.
   */
  isRunning(): boolean {
    return !!this.server
  }

  /**
   * Starts HTTPS auth server.
   */
  async start(): Promise<void> {

    // if server is already running, ignore
    if (this.server) return

    // todo: extract those options into configuration
    const domain = 'nate-is-awesome2.com' // Config.urls.authProxy
    const port = 3443 // Config.ports.server

    this.log.verbose('creating certificate')
    const ssl = await certificateFor(domain)

    this.log.verbose('creating auth https server')
    const app = express();
    this.server = await new Promise<Server>((ok, fail) => {
      const server = https.createServer(ssl, app).listen(port, err => {
        if (err) return fail(err)
        ok(server)
      })
    })
    this.log.verbose('auth https server was created')
  }

  /**
   * Stops running HTTPS auth server.
   */
  async stop(): Promise<void> {
    if (!this.server)
      return

    this.log.verbose('stopping auth https server')
    await new Promise((ok, fail) => {
      this.server.close(err => err ? fail(err) : ok())
    })
    this.log.verbose('auth https server was stopped')
  }

}
