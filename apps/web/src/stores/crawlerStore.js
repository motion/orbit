import r2 from '@mcro/r2'
import { store } from '@mcro/black'

const base = `http://localhost:3001`

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

  start = async () => {
    this.showing = false
    await this.stop()
    this.isRunning = true
    console.log('start crawl with settings', this.settings)
    await r2.post(`${base}/crawler/start`, {
      json: { options: this.settings },
    })
    this.setTimeout(this.onCheckStatus, 2500)
  }

  stop = async () => {
    await r2.post(`${base}/crawler/stop`)
    this.reset()
  }

  finish = async () => {
    this.results = await r2.get(`${base}/crawler/results`).json
    this.isFinished = true
  }

  hide = () => {
    this.showing = false
  }

  show = () => {
    this.showing = true
  }

  reset = () => {
    this.isRunning = false
    this.isFinished = false
    this.results = null
    this.status = null
  }

  onCheckStatus = async () => {
    const { status } = await r2.get(`${base}/crawler/status`).json
    if (!this.isRunning) {
      return
    }
    this.status = status
    if (status.results) {
      this.results = status.results
    }
    if (status.count > 0 && !status.isRunning) {
      this.isRunning = false
      this.finish()
    }
    if (this.isRunning) {
      this.setTimeout(this.onCheckStatus, 300)
    }
  }
}
