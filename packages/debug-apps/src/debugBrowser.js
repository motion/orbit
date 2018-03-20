import r2 from '@mcro/r2'
import puppeteer from 'puppeteer'
import { debounce, uniq, flatten, isEqual } from 'lodash'
const sleep = ms => new Promise(res => setTimeout(res, ms))

// import getExtensions from '@mcro/chrome-extensions'
// const extNames = getExtensions(['mobx', 'react'])
// const extensions = extNames.map(ext => `--load-extension=${ext}`)

// quiet exit handling
let exiting = false
const setExiting = () => {
  console.log('Exit debugbrowser...')
  exiting = true
  process.kill(process.pid)
}
process.on('unhandledRejection', function(reason) {
  if (exiting) return
  console.log('debug.unhandledRejection', reason)
  process.exit(0)
})
process.on('SIGUSR1', setExiting)
process.on('SIGUSR2', setExiting)
process.on('SIGSEGV', setExiting)
process.on('SIGINT', setExiting)
process.on('exit', setExiting)

export default class DebugApps {
  constructor({ sessions = [] }) {
    this.sessions = sessions
  }

  setSessions(next) {
    this.sessions = next
    this.render()
  }

  async start() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: [
        `--window-size=${800},${680}`,
        `--no-startup-window`,
        // `--disable-extensions-except=${extNames.join(',')}`,
        // ...extensions,
      ],
    })
    this.renderLoop()
  }

  renderLoop = async () => {
    while (true) {
      await this.render()
      await sleep(1000)
    }
  }

  getSessions = async () => {
    return uniq(
      flatten(await Promise.all(this.sessions.map(this.getDevUrl))).filter(
        Boolean,
      ),
    )
  }

  lastRes = {}

  getDevUrl = async ({ port, id }) => {
    const url = `http://127.0.0.1:${port}/${id ? `${id}/` : ''}json`
    try {
      const answers = await r2.get(url).json
      const res = flatten(
        answers
          .map(({ webSocketDebuggerUrl, url }) => {
            if (`${url}`.indexOf('chrome-extension') === 0) {
              return null
            }
            if (!webSocketDebuggerUrl) {
              return this.lastRes[url] || null
            }
            const debugUrl = `chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=${webSocketDebuggerUrl.replace(
              `ws://`,
              '',
            )}`
            const res = { debugUrl, url, port }
            this.lastRes[url] = res
            return res
          })
          .filter(Boolean),
      )
      return res
    } catch (err) {
      if (err.message.indexOf('ECONNREFUSED') !== -1) return
      console.log('dev-apps err', err.message, err.stack)
      return null
    }
  }

  pages = []

  getPages = async () => {
    this.pages = (await this.browser.pages()) || []
  }

  render = async () => {
    if (this.isRunning) return
    if (exiting) return
    const current = await this.getSessions()
    // memory overflow protect: only run if needed
    if (isEqual(current, this.current)) return
    this.current = current
    if (!this.browser) return
    // YO watch out:
    this.isRunning = true
    await this.getPages()
    const extraPages = this.pages.length - current.length
    if (extraPages > 0) {
      // close extras
      for (const page of this.pages.slice(this.pages.length - extraPages)) {
        try {
          await page.close()
        } catch (err) {
          console.log('page already closed', err.message)
        }
      }
      await this.getPages()
    }
    try {
      for (const [index, { debugUrl, url, port }] of current.entries()) {
        if (!this.pages[index]) {
          await this.browser.newPage()
          await sleep(50)
          await this.getPages()
        }
        const page = this.pages[index]
        if (!page) continue
        if (page.url() !== debugUrl) {
          await Promise.all([
            page.goto(debugUrl),
            page.waitForNavigation({
              timeout: 0,
              waitUntil: 'domcontentloaded',
            }),
          ])
          if (!this.pages[index]) continue
          const injectTitle = debounce(() => {
            // TODO can restart app on browser refresh here if wanted
            page.evaluate(
              (port, url) => {
                setTimeout(() => {
                  const PORT_NAMES = {
                    9000: 'Desktop',
                    9001: 'Electron',
                  }
                  const title = document.createElement('title')
                  title.innerHTML =
                    PORT_NAMES[port] || url.replace('http://localhost:3001', '')
                  document.head.appendChild(title)
                }, 500)
              },
              port,
              url,
            )
          }, 100)
          page.on('load', injectTitle)
          await page.focus('body')
          // delay to account for delayed title change on connect to debugger
          setTimeout(injectTitle, 500)
          // in iframe so simulate
          await page.mouse.click(160, 10) // click console
          await page.mouse.click(160, 70) // click into console
          await page.keyboard.press('PageDown') // page down to bottom
        }
      }
    } catch (err) {
      if (!exiting) {
        console.log('puppeteer.err', err)
      }
    }
    this.isRunning = false
  }
}
