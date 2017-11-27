import r2 from '@mcro/r2'
import { store } from '@mcro/black'

const base = `http://localhost:3001`
let activeCrawlers = []

@store
export default class Crawler {
  results = null
  settings = null
  status = null
  isRunning = false
  isFinished = false
  showing = false
  id = null

  constructor() {
    this.id = Math.random() + ''
  }

  start = async settings => {
    this.settings = {
      maxPages: 30,
      depth: '/',
      ...settings,
    }
    console.log('starting crawl', this.settings)
    this.showing = false
    this.clean()
    await Promise.all(
      activeCrawlers.map(async crawler => {
        if (crawler.isRunning) {
          await crawler.stop()
        }
      })
    )
    this.isRunning = true
    await r2.post(`${base}/crawler/start`, {
      json: { options: this.settings },
    })
    this.setTimeout(this.onCheckStatus, 2500)
  }

  stop = async () => {
    await r2.post(`${base}/crawler/stop`)
    this.clean()
  }

  finish = async () => {
    this.results = await r2.get(`${base}/crawler/results`).json
    this.isFinished = true
    activeCrawlers.push(this)
  }

  hide = () => {
    this.showing = false
  }

  show = () => {
    this.showing = true
  }

  clean = () => {
    console.log('cleaning')
    this.isRunning = false
    this.isFinished = false
    this.results = null
    this.status = null
    activeCrawlers = activeCrawlers.filter(c => c.id !== this.id)
  }

  onCheckStatus = async () => {
    const { status } = await r2.get(`${base}/crawler/status`).json
    this.status = status
    if (status.count > 0 && !status.isRunning) {
      this.isRunning = false
      this.finish()
    }
    if (this.isRunning) {
      setTimeout(this.onCheckStatus, 300)
    }
  }
}
