import r2 from '@mcro/r2'
import { store } from '@mcro/black'

const base = `http://localhost:3001`
let activeCrawlers = []

@store
export default class Crawler {
  settings = null
  results = null
  settings = null
  status = null
  isRunning = false
  isFinished = false
  showing = false
  id = null

  constructor(settings) {
    if (settings) {
      this.settings = settings
    }
    this.id = Math.random() + ''
  }

  async onStart() {
    this.clean()
    activeCrawlers.forEach(async crawler => {
      if (crawler.isRunning) {
        await crawler.onStop()
      }
      return true
    })
    this.isRunning = true
    await r2.post(`${base}/crawler/start`, {
      json: { options: this.settings || {} },
    })
    this.setTimeout(this.onCheckStatus, 2500)
  }

  async onStop() {
    await r2.post(`${base}/crawler/stop`)
    this.clean()
  }

  async onFinished() {
    this.results = await r2.get(`${base}/crawler/results`).json
    this.isFinished = true
    activeCrawlers.push(this)
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
      this.onFinished()
    }
    if (this.isRunning) {
      setTimeout(this.onCheckStatus, 300)
    }
  }
}
