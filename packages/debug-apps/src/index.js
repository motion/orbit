#!/usr/bin/env node
import r2 from '@mcro/r2'
import puppeteer from 'puppeteer'
// start listening for browser debuggers
import './server'

process.on('unhandledRejection', function(reason) {
  console.log(reason)
  process.exit(0)
})

let exited = false
process.on('beforeExit', () => {
  exited = true
})

const DEV_URL =
  'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws='

class DebugApps {
  constructor({ ports = [] }) {
    this.ports = ports
    this.urls = []
  }

  async start() {
    const browser = await puppeteer.launch({ headless: false })
    // one less because it starts with a tab already open
    await Promise.all(this.ports.slice(1).map(() => browser.newPage()))
    this.pages = await browser.pages()
    this.watchForNewDevUrls()
  }

  async getDevUrls() {
    return await Promise.all(this.ports.map(this.getDevUrl))
  }

  async getDevUrl(port) {
    try {
      const [firstAnswer] = await r2.get(`http://127.0.0.1:${port}/json`).json
      const { webSocketDebuggerUrl } = firstAnswer
      if (!webSocketDebuggerUrl) {
        return null
      }
      return `${DEV_URL}/${webSocketDebuggerUrl.replace(`ws://`, '')}`
    } catch (err) {
      return null
    }
  }

  watchForNewDevUrls() {
    setInterval(async () => {
      if (exited) return
      const urls = await this.getDevUrls()
      for (const [index, url] of urls.entries()) {
        if (this.urls[index] !== url) {
          this.urls[index] = url
          if (url) {
            this.pages[index].goto(url)
          }
        }
      }
    }, 500)
  }
}

async function start() {
  const app = new DebugApps({
    ports: ['9000', '9001'],
  })
  app.start()
}

start()
