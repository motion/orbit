import r2 from '@mcro/r2'
import puppeteer from 'puppeteer'

const sleep = ms => new Promise(res => setTimeout(res, ms))

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
    const url = `http://127.0.0.1:${port}/${id ? `${id}/` : ''}json`
    try {
      const [firstAnswer, ...rest] = await r2.get(url).json
      if (rest.length) console.log('rest', rest)
      const { webSocketDebuggerUrl } = firstAnswer
      if (!webSocketDebuggerUrl) {
        return null
      }
      return `${DEV_URL}/${webSocketDebuggerUrl.replace(`ws://`, '')}`
    } catch (err) {
      console.log('error fetching', url)
      return null
    }
  }

  render = async () => {
    if (exited) return
    const urls = await this.getSessions()
    if (!this.browser) {
      console.log('error no browser wierd')
      return
    }
    let pages = await this.browser.pages()
    if (!pages) {
      console.log('Error DebugBrowser.render: no pages')
      return
    }
    for (const [index, url] of urls.entries()) {
      if (this.urls[index] === url) {
        continue
      }
      this.urls[index] = url
      if (!url) continue
      if (!pages[index]) {
        await this.browser.newPage()
        await sleep(20)
        pages = await this.browser.pages()
        if (!pages) {
          console.log('weird no pages............')
          return
        }
      }
      const page = pages[index]
      await Promise.all([
        page.waitForNavigation({
          timeout: 5000,
          waitUntil: 'domcontentloaded',
        }),
        page.goto(url),
      ])
      await page.evaluate(() => {
        // open console
        let x = document.getElementById('tab-console')
        if (x) x.click()
        else {
          console.log('no element')
        }
      })
    }
  }
}
