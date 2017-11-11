// @flow
import 'isomorphic-fetch'
import { parse } from 'url'
import puppeteer from 'puppeteer'
import debug from 'debug'
import CrawlerDB from './crawlerDB'
import type { Options } from '~/types'

const log = {
  crawl: debug('crawler:crawl'),
  page: debug('crawler:page'),
}

const cleanUrl = url => url.replace(/[#](.*)$/g, '')

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
      // maxOffPathRadius, this would be really nice
      depth,
    } = options

    const matchPath = url => {
      return parse(url).pathname.indexOf(depth) === 0
    }

    let target = this.db.popUrl() || { url: cleanUrl(entry), radius: 0 }

    if (!target.url) {
      log.crawl('no url')
      return
    }
    if (!options.titleSelector || !options.bodySelector) {
      log.crawl(`needs title/body selector`)
      return
    }

    const entryUrl = parse(target.url)
    const browser = await puppeteer.launch(puppeteerOptions)
    const page = await browser.newPage()

    let count = 0
    while (target && this.shouldCrawl) {
      if (target.radius >= maxRadius) {
        log.page(`Maximum radius reached, did not crawl ${target.url}`)
      } else {
        const isValidPath = !matchPath || matchPath(target.url)

        // content-type whitelist
        const res = await fetch(target.url, { method: 'HEAD' })
        if (
          !res.headers ||
          !res.headers.has('content-type') ||
          !/text\/(html|xml)/g.test(res.headers.get('content-type'))
        ) {
          log.page(
            `No content type or invalid: ${res.headers.get('content-type')}`
          )
          continue
        }

        log.page(`Crawling ${target.url}`)
        try {
          await page.goto(target.url)
          const links = (await page.evaluate(async () => {
            return Array.from(document.querySelectorAll('[href]')).map(
              link => link.href
            )
          })).map(cleanUrl)
          const outboundUrls = links.filter(link => {
            return parse(link).host === entryUrl.host
          })
          log.page(`Found ${outboundUrls.length} urls`)
          // this allows it to crawl pages that arent valid matches
          // but could lead back to valid pages
          // should have a flag to make stricter if desired
          if (isValidPath) {
            count++
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
            this.db.store({
              outboundUrls,
              contents,
              radius: ++target.radius,
              url: target.url,
            })
          }
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
