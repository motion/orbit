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
    this.render()
  }

  async start() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: [`--window-size=${800},${600}`],
    })
    // one less because it starts with a tab already open
    await Promise.all(this.sessions.slice(1).map(() => this.browser.newPage()))
    setInterval(this.render, 500)
  }

  async getSessions() {
    return await Promise.all(this.sessions.map(this.getDevUrl))
  }

  async getDevUrl({ port, id }) {
    try {
      const [firstAnswer, ...rest] = await r2.get(
        `http://127.0.0.1:${port}/${id ? `${id}/` : ''}json`,
      ).json
      if (rest.length) console.log('rest', rest)
      const { webSocketDebuggerUrl } = firstAnswer
      if (!webSocketDebuggerUrl) {
        return null
      }
      return `${DEV_URL}/${webSocketDebuggerUrl.replace(`ws://`, '')}`
    } catch (err) {
      console.log('got errrr', err)
      return null
    }
  }

  render = async () => {
    if (exited) return
    const urls = await this.getSessions()
    let pages = await this.browser.pages()
    for (const [index, url] of urls.entries()) {
      if (this.urls[index] === url) {
        continue
      }
      this.urls[index] = url
      console.log('>>', index, url)
      if (!url) continue
      if (!pages[index]) {
        await this.browser.newPage()
        pages = await this.browser.pages()
      }
      const page = pages[index]
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
