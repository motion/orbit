import r2 from '@mcro/r2'
import puppeteer from 'puppeteer'

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

export default class DebugApps {
  constructor({ sessions = [] }) {
    this.sessions = sessions
    this.urls = []
  }

  setSessions(next) {
    this.sessions = next
    this.getNewDevUrls()
  }

  async start() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: [`--window-size=${800},${600}`],
    })
    // one less because it starts with a tab already open
    await Promise.all(this.sessions.slice(1).map(() => this.browser.newPage()))
    this.pages = await this.browser.pages()
    this.watchForNewDevUrls()
  }

  async getDevUrls() {
    return await Promise.all(this.sessions.map(this.getDevUrl))
  }

  async getDevUrl({ port, id }) {
    try {
      const [firstAnswer] = await r2.get(
        `http://127.0.0.1:${port}/${id ? `/${id}` : ''}json`,
      ).json
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
    setInterval(this.getNewDevUrls, 500)
  }

  getNewDevUrls = async () => {
    if (exited) return
    const urls = await this.getDevUrls()
    for (const [index, url] of urls.entries()) {
      if (this.urls[index] !== url) {
        this.urls[index] = url
        if (url) {
          if (!this.pages[index]) {
            await this.browser.newPage()
            this.pages = await this.browser.pages()
          }
          const page = this.pages[index]
          await Promise.all([
            page.waitForNavigation({ timeout: 5000, waitUntil: 'load' }),
            page.goto(url),
          ])
          await page.evaluate(() => {
            // open console
            let x = document.getElementById('tab-console')
            if (x) x.click()
          })
        }
      }
    }
  }
}
