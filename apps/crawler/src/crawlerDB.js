import debug from 'debug'
import { sortBy } from 'lodash'

const log = debug('crawler:db')

export default class CrawlerDB {
  crawled = []
  discoveredUrls = {}
  pageQueue = []
  scoreFn = () => 0

  constructor(options = {}) {
    this.disableLinkFinding = options.disableLinkFinding
    if (options.queue) {
      this.pageQueue = options.queue
    }
  }

  store = page => {
    if (!page) {
      console.log('not storing')
      return
    }
    log(`Store -> ${page.url}`)
    this.crawled.push(page)
    if (this.disableLinkFinding) {
      return
    }
    let count = 0
    const radius = page.radius
    page.outboundUrls.forEach(url => {
      if (!this.discoveredUrls[url]) {
        count++
        const score = this.scoreFn(url)
        this.pageQueue.push({ url, radius, score })
        this.discoveredUrls[url] = true
      }
    })
    if (count) {
      this.pageQueue = sortBy(this.pageQueue, 'score').reverse()
      log(`Added ${count} new urls to queue`)
      log(`New top of queue: ${this.pageQueue[0].url}`)
      const duplicates = page.outboundUrls.length - count
      if (duplicates) {
        log(`${page.outboundUrls.length - count} duplicates found`)
      }
    }
  }

  setScoringFn(scoreFn) {
    this.scoreFn = scoreFn
  }

  popUrl = () => {
    console.log('pop', this.pageQueue[0])
    if (this.pageQueue.length) {
      return this.pageQueue.pop()
    }
    return null
  }

  shiftUrl = () => {
    if (this.pageQueue.length) {
      return this.pageQueue.shift()
    }
    return null
  }

  getValid = () => {
    return this.crawled.filter(_ => _.contents !== null)
  }

  getAll() {
    return this.crawled
  }
}
