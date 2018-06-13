import r2 from '@mcro/r2'
import puppeteer from 'puppeteer'
import * as _ from 'lodash'
const sleep = ms => new Promise(res => setTimeout(res, ms))

// import getExtensions from '@mcro/chrome-extensions'
// const extNames = getExtensions(['mobx', 'react'])
// const extensions = extNames.map(ext => `--load-extension=${ext}`)

const onFocus = page => {
  return page.evaluate(() => {
    return new Promise(res => {
      if (document.hasFocus()) {
        res()
      } else {
        window.onfocus = () => res()
      }
    })
  })
}

export default class DebugApps {
  isRendering?: Boolean
  disposed?: Boolean
  browser: any
  options: any
  sessions = []
  intervals = []

  constructor({ sessions = [], ...options }) {
    this.sessions = sessions
    this.options = options
  }

  setSessions(next) {
    this.sessions = next
  }

  get shouldRun() {
    return this.browser && !this.disposed
  }

  async start() {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
        args: [
          `--window-size=${800},${680}`,
          '--disable-infobars',
          // `--no-startup-window`,
          // `--enable-slim-navigation-manager`,
          // `--top-controls-hide-threshold=0.5`,
          // `--disable-extensions-except=${extNames.join(',')}`,
          // ...extensions,
        ],
      })
      this.browser.on('disconnected', this.dispose)
      this.renderLoop()
    } catch (err) {
      console.log('DebugBrowser Err', err)
    }
  }

  dispose = async () => {
    this.disposed = true
    this.clearIntervals()
    if (this.browser) {
      await this.browser.close()
    }
  }

  renderLoop = async () => {
    while (this.shouldRun) {
      const sessions = await this.getSessions()
      if (await this.shouldUpdateTabs(sessions)) {
        // when desktop restarts, the dev urls for some reason change in electron
        // then the debugger attempts to change to that new url, which makes white bg appear
        // then once desktop starts up again, the dev urls return again as they were
        // so sleep 1s here when we see a change, and hope desktop has restarted, so we dont
        // ever see those weird urls......
        await sleep(2000)
        await this.render()
      }
      await sleep(500)
    }
  }

  getSessions = async () => {
    return _.uniq(
      _.flatten(await Promise.all(this.sessions.map(this.getDevUrl))).filter(
        Boolean,
      ),
    )
  }

  lastRes = {}

  getDevUrl = async ({ port, id }) => {
    const url = `http://127.0.0.1:${port}/${id ? `${id}/` : ''}json`
    try {
      const answers = await r2.get(url).json
      const res = _.flatten(
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
    if (!this.browser) {
      return []
    }
    return (await this.browser.pages()) || []
  }

  numTabs = curSessions => {
    return (
      this.options.expectTabs ||
      Math.max(curSessions.length, this.sessions.length)
    )
  }

  ensureEnoughTabs = async sessions => {
    const pages = await this.getPages()
    const tabsToOpen = this.numTabs(sessions) - pages.length
    if (tabsToOpen > 0) {
      await Promise.all(
        _.range(tabsToOpen).map(async () => {
          const page = await this.browser.newPage()
          // this handily defocuses the url bar
          await page.bringToFront()
        }),
      )
    }
    const initialRender = pages.length === 0
    if (initialRender) {
      // focus first tab on startup
      const pages = await this.getPages()
      pages[0].bringToFront()
    }
  }

  shouldUpdateTabs = async sessions => {
    const pages = await this.getPages()
    const shouldUpdates = sessions.reduce((acc, session, index) => {
      const page = pages[index]
      acc[index] = !page || page.url() !== session.debugUrl ? true : false
      return acc
    }, [])
    if (!shouldUpdates.reduce((a, b) => a || b, false)) {
      return false
    }
    return shouldUpdates
  }

  openUrlsInTabs = async (sessions, pages, updateTabs) => {
    await Promise.all(
      updateTabs.map(async (shouldUpdate, index) => {
        if (!shouldUpdate) return
        const page = pages[index]
        if (!page) return
        page.goto(sessions[index].debugUrl)
        await page.waitForNavigation({
          timeout: 0,
          waitUntil: 'domcontentloaded',
        })
      }),
    )
  }

  removeExtraTabs = async sessions => {
    const pages = await this.getPages()
    const extraPages = this.numTabs(sessions) - pages.length
    if (extraPages > 0) {
      // close extras
      for (const page of pages.slice(pages.length - extraPages)) {
        try {
          await page.close()
        } catch (err) {
          console.log('page already closed', err.message)
        }
      }
      await this.getPages()
    }
  }

  finishLoadingPage = async (index, page, { url, port }) => {
    if (!page) {
      return
    }
    const injectTitle = async () => {
      if (!this.shouldRun) {
        return
      }
      // TODO can restart app on browser refresh here if wanted
      try {
        await page.evaluate(
          (port, url) => {
            try {
              const PORT_NAMES = {
                9000: 'Desktop',
                9001: 'Electron',
              }
              let title = document.getElementsByTagName('title')[0]
              if (!title) {
                title = document.createElement('title')
                document.head.appendChild(title)
              }
              const titleText =
                PORT_NAMES[port] || url.replace('http://localhost:3001', '')
              title.innerHTML = titleText
            } catch (err) {
              console.log('error doing this', err)
            }
          },
          port,
          url,
        )
      } catch (err) {
        console.log('err in eval', err.message)
      }
    }
    page.on('close', () => {
      clearInterval(this.intervals[index])
    })
    clearInterval(this.intervals[index])
    this.intervals[index] = setInterval(injectTitle, 5000)
    onFocus(page).then(async () => {
      await sleep(50)
      await page.frames()[0].focus('body')
      await page.mouse.click(540, 10) // click out of screenshare
      await page.mouse.click(145, 40) // click context dropdown
      await page.mouse.click(145, 70) // click context first context item
      await page.mouse.click(145, 10) // click console
      await page.mouse.click(145, 70) // click into console
      await page.keyboard.press('PageDown') // page down to bottom
    })
  }

  render = async () => {
    if (this.isRendering || !this.shouldRun) {
      return
    }
    const sessions = await this.getSessions()
    const shouldUpdate = await this.shouldUpdateTabs(sessions)
    if (!shouldUpdate || !this.shouldRun) {
      return
    }
    // YO watch out:
    this.isRendering = true
    try {
      await this.ensureEnoughTabs(sessions)
      const pages = await this.getPages()
      console.log('updating', shouldUpdate)
      await this.openUrlsInTabs(sessions, pages, shouldUpdate)
      // synchronously
      for (const [index] of shouldUpdate.entries()) {
        const { url, port } = sessions[index]
        await this.finishLoadingPage(index, pages[index], { url, port })
      }
    } catch (err) {
      console.log('puppeteer.err', err)
    }
    // delete extra tabs
    await this.removeExtraTabs(sessions)
    this.isRendering = false
  }

  clearIntervals = () => {
    if (this.intervals) {
      this.intervals.map(x => clearInterval(x))
      this.intervals = []
    }
  }
}
