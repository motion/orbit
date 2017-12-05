import r2 from '@mcro/r2'
import { store } from '@mcro/black'
import { API_URL } from '~/constants'
import { createInChunks } from '~/sync/helpers'
import { Thing } from '~/app'

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

  commitResults = async () => {
    this.emit('banner', { type: 'note', message: 'Saving...' })
    const { results } = this.crawler
    this.reset()
    if (results) {
      await createInChunks(results, Thing.createFromCrawlResult)
      this.emit('banner', { type: 'success', message: 'Saved results!' })
    }
  }

  start = async settings => {
    this.reset()
    if (settings) {
      this.settings = settings
    }
    this.isRunning = true
    console.log('start crawl with settings', this.settings)
    await r2.post(`${API_URL}/crawler/start`, {
      json: { options: this.settings },
    })
    this.setTimeout(this.onCheckStatus, 2500)
  }

  stop = async () => {
    await r2.post(`${API_URL}/crawler/stop`)
    this.reset()
  }

  finish = async () => {
    this.results = await r2.get(`${API_URL}/crawler/results`).json
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
    const { status } = await r2.get(`${API_URL}/crawler/status`).json
    if (!this.isRunning) {
      return
    }
    this.status = status
    if (status.results) {
      this.results = status.results
    }
    if (!status.isRunning) {
      this.isRunning = false
      this.finish()
    }
    if (this.isRunning) {
      this.setTimeout(this.onCheckStatus, 300)
    }
  }
}
