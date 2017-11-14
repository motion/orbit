import debug from 'debug'
import { sortBy } from 'lodash'

const log = debug('crawler:db')

export default class CrawlerDB {
  crawled = []
  discoveredUrls = {}
  pageQueue = []
  scoreFn = () => 0

  store = page => {
    log(`Store -> ${page.url}`)
    this.crawled.push(page)
    let count = 0
    const radius = page.radius
    for (const url of page.outboundUrls) {
      if (!this.discoveredUrls[url]) {
        count++
        const score = this.scoreFn(url)
        this.pageQueue.push({ url, radius, score })
        this.discoveredUrls[url] = true
      }
    }
    // add to beginning
    this.pageQueue = sortBy(this.pageQueue, 'score').reverse()
    log(`Added ${count} new urls to queue`)
    const duplicates = page.outboundUrls.length - count
    if (duplicates) {
      log(`${page.outboundUrls.length - count} duplicates found`)
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
    console.log('shift', this.pageQueue[0])
    if (this.pageQueue.length) {
      return this.pageQueue.shift()
    }
    return null
  }

  getAll() {
    return this.crawled
  }
}
