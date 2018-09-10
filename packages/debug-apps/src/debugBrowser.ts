import * as r2 from '@mcro/r2'
import puppeteer from 'puppeteer'
import { flatten, range } from 'lodash'
const sleep = ms => new Promise(res => setTimeout(res, ms))

type DevInfo = {
  debugUrl: string
  url: string
  port: string
}

const REMOTE_URL = 'http://localhost:3001'

const onFocus = page => {
  return page.evaluate(() => {
    return new Promise(res => {
      if (document.hasFocus()) {
        res()
      } else {
        window.onfocus = () => res()
      }
      setTimeout(() => {
        res()
      }, 3000)
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

  get shouldRun() {
    return this.browser && !this.disposed
  }

  async start() {
    try {
      console.log('launching puppeteer...')
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
      await this.ensureEnoughTabs(sessions)
      const updateTabs = await this.shouldUpdateTabs(sessions)
      if (updateTabs.some(x => x === true)) {
        await this.render()
      }
      await sleep(500)
    }
  }

  getSessions = async (): Promise<any> => {
    return flatten(await Promise.all(this.sessions.map(this.getDevUrl)))
  }

  lastRes = {}

  getUrlForJsonInfo = (jsonInfo, port) => {
    if (!jsonInfo) {
      return ''
    }
    const { webSocketDebuggerUrl, url } = jsonInfo
    if (!webSocketDebuggerUrl) {
      return this.lastRes[url] || null
    }
    const debugUrl = `chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=${webSocketDebuggerUrl.replace(
      'ws://',
      '',
    )}`
    const res = { debugUrl, url, port }
    this.lastRes[url] = res
    return res
  }

  getDevUrl = ({ port, id }): Promise<DevInfo[] | null> => {
    return new Promise(async resolve => {
      const infoUrl = `http://127.0.0.1:${port}/${id ? `${id}/` : ''}json`
      // timeout because it doesnt resolve if the app is down
      setTimeout(() => {
        resolve(null)
      }, 1000)
      try {
        const answers = await r2.get(infoUrl).json
        resolve(
          answers
            .map(answer => {
              if (
                answer.url.indexOf('file://') === 0 ||
                answer.url.indexOf(REMOTE_URL) === 0
              ) {
                return this.getUrlForJsonInfo(answer, port)
              }
              // if its a "electron background page", we dont want it
              return null
            })
            .filter(Boolean),
          // sort so the tab order stays stable
          // .sort((a, b) => a.url.localeCompare(b.url)),
        )
      } catch (err) {
        if (err.message.indexOf('ECONNREFUSED') !== -1) return
        console.log('dev err', err.message)
        resolve(null)
      }
    })
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
        range(tabsToOpen).map(async () => {
          const page = await this.browser.newPage()
          // this handily defocuses the url bar
          await page.bringToFront()
        }),
      )
    }
    const initialRender = pages.length === 0
    if (initialRender) {
      // focus first tab on startup
      await this.getPages()
      // pages[0].bringToFront()
    }
  }

  shouldUpdateTabs = async (sessions): Promise<boolean[]> => {
    const urls = (await this.getPages()).map(page => page.url())
    const result = sessions.map(() => true)
    for (const [index, session] of sessions.entries()) {
      if (!session) {
        result[index] = false
        continue
      }
      if (urls.indexOf(session.debugUrl) > -1) {
        result[index] = false
      }
    }
    return result
  }

  openUrlsInTabs = async (sessions, pages, updateTabs) => {
    let opens = []
    for (const [index, update] of updateTabs.entries()) {
      const page = pages[index]
      if (!page || !update || !sessions[index]) {
        continue
      }
      opens.push(
        page.goto(sessions[index].debugUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 0,
        }),
      )
    }
    return await Promise.all(opens)
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
              const titleText = PORT_NAMES[port] || url.replace(REMOTE_URL, '')
              if (titleText) {
                title.innerHTML = titleText
              }
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
    injectTitle()
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
    if (!shouldUpdate.some(x => x === true) || !this.shouldRun) {
      return
    }
    // YO watch out:
    this.isRendering = true
    try {
      const pages = await this.getPages()
      if (
        this.options.expectTabs &&
        shouldUpdate.length > this.options.expectTabs
      ) {
        return
      }
      await this.openUrlsInTabs(sessions, pages, shouldUpdate)
      await sleep(300)
      // synchronously
      for (const [index, update] of shouldUpdate.entries()) {
        if (!update) continue
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
