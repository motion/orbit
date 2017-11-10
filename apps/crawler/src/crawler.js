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
    const {
      puppeteerOptions,
      maxPages = Infinity,
      maxRadius = Infinity,
    } = options

    let target = this.db.popUrl() || { url: entry, radius: 0 }

    if (!target.url) {
      log.crawl('no url')
      return
    }
    if (!options.titleSelector || !options.bodySelector) {
      log.crawl(`needs title/body selector`)
      return
    }

    const entryUrl = url.parse(target.url)
    const browser = await puppeteer.launch(puppeteerOptions)
    const page = await browser.newPage()

    let count = 0
    while (target && this.shouldCrawl) {
      if (target.radius >= maxRadius) {
        log.page(`Maximum radius reached, did not crawl ${target.url}`)
      } else {
        count++
        log.page(`Crawling ${target.url}`)
        try {
          await page.goto(target.url)
          const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('[href]')).map(
              link => link.href
            )
          })
          const contents = await page.evaluate(async options => {
            const titleNode = document.querySelector(options.titleSelector)
            const bodyNodes = Array.from(
              document.querySelectorAll(options.bodySelector)
            )
            return {
              title: titleNode ? titleNode.innerText : '',
              body: bodyNodes.length
                ? bodyNodes.map(node => node.innerText).join('\n\n')
                : '',
            }
          }, options)
          console.log('GOTCHA', contents)
          const outboundUrls = links.filter(link => {
            return url.parse(link).host === entryUrl.host
          })
          log.page(`Found ${outboundUrls.length} urls`)
          this.db.store({
            outboundUrls,
            contents,
            radius: ++target.radius,
            url: target.url,
          })
        } catch (err) {
          log.page(`Error crawling url ${target.url} ${err.message}`)
        }
      }
      if (count >= maxPages) {
        log.crawl(`Max pages reached! ${maxPages}`)
        break
      }
      target = this.db.popUrl()
    }

    log.crawl(`Crawler done, crawled ${count} pages`)
    browser.close()
    // return all items stored
    return this.db.getAll()
  }

  stop() {
    this.shouldCrawl = false
  }
}
