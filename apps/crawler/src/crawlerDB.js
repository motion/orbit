import debug from 'debug'

const log = debug('crawler:db')

export default class CrawlerDB {
  crawled = []
  discoveredUrls = {}
  pageQueue = []

  store = page => {
    log(`Store -> ${page.url}`)
    this.crawled.push(page)
    let count = 0
    const radius = page.radius
    for (const url of page.outboundUrls) {
      if (!this.discoveredUrls[url]) {
        count++
        this.pageQueue.push({ url, radius })
        this.discoveredUrls[url] = true
      }
    }
    log(`Added ${count} new urls to queue`)
    const duplicates = page.outboundUrls.length - count
    if (duplicates) {
      log(`${page.outboundUrls.length - count} duplicates found`)
    }
  }

  popUrl = () => {
    if (this.pageQueue.length) {
      return this.pageQueue.pop()
    }
    return null
  }
}
