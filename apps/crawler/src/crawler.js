// @flow
import url from 'url'
import puppeteer from 'puppeteer'
import debug from 'debug'
import CrawlerDB from './crawlerDB'

const log = {
  crawl: debug('crawler:crawl'),
  page: debug('crawler:page'),
}

type Options = {
  matchPath?: Function,
  maxPages?: number,
  maxRadius?: number,
  puppeteerOptions?: Object,
}

export default class Crawler {
  shouldCrawl = true

  constructor(options: Options) {
    this.options = options
    this.db = new CrawlerDB()
  }

  async start(entry: string, options: Options = this.options) {
    log.crawl('Starting crawler')
    let target = this.db.popUrl() || { url: entry, radius: 0 }
    const {
      puppeteerOptions,
      maxPages = Infinity,
      maxRadius = Infinity,
    } = options

    if (!target.url) {
      log.crawl('no url')
      return
    }

    const entryUrl = url.parse(target.url)
    const browser = await puppeteer.launch(puppeteerOptions)
    const page = await browser.newPage()
    const next = () => {
      target = this.db.popUrl()
    }

    let count = 0
    while (target && this.shouldCrawl) {
      if (target.radius >= maxRadius) {
        log.page(`Maximum radius reached, did not crawl ${target.url}`)
      } else {
        log.page(`Crawling ${target.url}`)
        try {
          await page.goto(target.url)
          count++
        } catch (err) {
          log.page(`Error crawling url ${target.url}`)
          next()
          continue
        }
        let outboundUrls
        try {
          const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[href]')).map(
              link => link.href
            )
          })
          outboundUrls = links.filter(link => {
            return url.parse(link).host === entryUrl.host
          })
        } catch (err) {
          log.page(`Error parsing page: ${err.message}`)
          next()
          continue
        }
        log.page(`Found ${outboundUrls.length} urls`)
        this.db.store({
          outboundUrls,
          radius: ++target.radius,
          url: target.url,
        })
      }
      if (count >= maxPages) {
        break
      }
      next()
    }

    log.crawl(`Crawler done, crawled ${count} pages`)
    browser.close()
  }

  stop() {
    this.shouldCrawl = false
  }
}
