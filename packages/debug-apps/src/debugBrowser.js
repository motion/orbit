import r2 from '@mcro/r2'
import puppeteer from 'puppeteer'
import { uniq, flatten, isEqual } from 'lodash'
const sleep = ms => new Promise(res => setTimeout(res, ms))

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
  cache = {}

  constructor({ sessions = [] }) {
    this.sessions = sessions
  }

  setSessions(next) {
    this.sessions = next
    this.render()
  }

  async start() {
    console.log('puppeteer.defaultArgs()', puppeteer.defaultArgs())
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--disable-infobars', `--window-size=${800},${680}`],
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

  lastUrl = {}

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
              return this.lastUrl[url] || null
            }
            const fullUrl = `chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=${webSocketDebuggerUrl.replace(
              `ws://`,
              '',
            )}`
            this.lastUrl[url] = fullUrl
            return fullUrl
          })
          .filter(Boolean),
      )
      this.cache[url] = res
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
    const urls = await this.getSessions()
    // memory overflow protect: only run if needed
    if (isEqual(urls, this.urls)) return
    this.urls = urls
    if (!this.browser) return
    // YO watch out:
    this.isRunning = true
    await this.getPages()
    const extraPages = this.pages.length - urls.length
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
      for (const [index, url] of urls.entries()) {
        if (!this.pages[index]) {
          await this.browser.newPage()
          await sleep(50)
          await this.getPages()
        }
        const page = this.pages[index]
        if (!page) continue
        if (page.url() !== url) {
          await Promise.all([
            page.waitForNavigation({
              timeout: 0,
              waitUntil: 'domcontentloaded',
            }),
            page.goto(url),
          ])
          await sleep(500)
          if (!this.pages[index]) continue
          // in iframe so simulate
          await page.mouse.click(110, 10) // click console
          await page.mouse.click(110, 70) // click into console
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
