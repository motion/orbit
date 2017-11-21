// @flow
import 'isomorphic-fetch'
import { parse } from 'url'
import puppeteer from 'puppeteer'
import debug from 'debug'
import CrawlerDB from './crawlerDB'
import type { Options } from '~/types'
import { uniq } from 'lodash'

const log = {
  crawl: debug('crawler:crawl'),
  page: debug('crawler:page'),
}

const ENDING_QUERY = /[?](.*)$/g
const ENDING_HASH = /[#](.*)$/g

const removeLastSegmentOfPath = x => x.replace(/\/[^\/]+$/g, '')
const cleanUrlHash = url => url.replace(ENDING_HASH, '')
const cleanUrlSearch = url => url.replace(ENDING_QUERY, '')
const cleanUrlEnd = url => cleanUrlHash(cleanUrlSearch(url))

const FILTER_URL_EXTENSIONS = [
  '.png',
  '.jpg',
  '.gif',
  '.css',
  '.js',
  '.svg',
  '.xml',
]

const urlSimilarity = (wanted, given) => {
  let score = 100
  // de-weight paths with ?params just a lil
  if (/[?](.*)$/g.test(given)) {
    score -= 4
  }
  // avoid those paths confusing the score
  let curPath = cleanUrlEnd(given)
  const segments = given.split('/').length
  for (let i = 0; i < segments; i++) {
    if (wanted === curPath) {
      return score
    }
    score--
    curPath = removeLastSegmentOfPath(curPath)
  }
  return 0
}

const urlMatchesExtensions = (url, extensions) => {
  const extension = cleanUrlEnd(url).slice(url.length - 4, url.length)
  return extensions.indexOf(extension) >= 0
}

export default class Crawler {
  shouldCrawl = true
  isRunning = false
  count = 0

  constructor(options: Options) {
    this.options = options
    this.db = new CrawlerDB()
  }

  async start(entry: string, runOptions: Options = this.options) {
    if (!entry) {
      throw new Error('No entry given!')
    }
    this.shouldCrawl = true
    log.crawl('Starting crawler')
    // merge options
    const options = {
      ...this.options,
      ...runOptions,
    }
    const {
      puppeteerOptions,
      maxPages = Infinity,
      maxRadius = Infinity,
      // maxOffPathRadius, this would be really nice
      depth,
      filterUrlExtensions = FILTER_URL_EXTENSIONS,
    } = options

    const matchPath = url => {
      return parse(url).pathname.indexOf(depth) === 0
    }

    const initialUrl = cleanUrlHash(entry)
    let target = { url: initialUrl, radius: 0 }

    if (!target.url) {
      log.crawl('no url')
      return
    }
    if (!options.titleSelector || !options.bodySelector) {
      log.crawl(`needs title/body selector`)
      return
    }

    const entryUrl = parse(target.url)
    const fullMatchUrl = `${entryUrl.protocol}//${entryUrl.host}${depth}`

    log.crawl('scoring closest to url:', fullMatchUrl)
    this.db.setScoringFn(url => urlSimilarity(fullMatchUrl, url))

    const browser = await puppeteer.launch(puppeteerOptions)
    const page = await browser.newPage()

    this.count = 0
    this.isRunning = true

    while (target && this.shouldCrawl) {
      if (urlMatchesExtensions(target.url, filterUrlExtensions)) {
        log.page(`Looks like an image, avoid ${target.url}`)
      } else if (target.radius >= maxRadius) {
        log.page(`Maximum radius reached, did not crawl ${target.url}`)
      } else {
        const isValidPath = matchPath(target.url)

        if (!isValidPath) {
          log.page(`Path is not at same depth:`)
          log.page(`  ${parse(target.url).pathname}`)
          log.page(`  ${depth}`)
          continue
        }

        // content-type whitelist
        const res = await fetch(target.url, { method: 'HEAD' })
        const contentType =
          res.headers.get('content-type') || res.headers.get('Content-Type')
        if (!contentType || !/text\/(html|xml)/g.test(contentType)) {
          log.page(
            `Bad content-type: ${res.headers.get('content-type')} ${target.url}`
          )
          continue
        }

        log.page(`Crawling ${target.url}`)
        try {
          await page.goto(target.url, {
            waitLoad: true,
          })
          const links = await page.evaluate(async () => {
            return Array.from(document.querySelectorAll('[href]')).map(
              link => link.href
            )
          })
          let outboundUrls = uniq(links.map(cleanUrlHash)).filter(link => {
            const matchesHost = parse(link).host === entryUrl.host
            const isNotOriginalUrl = link !== initialUrl
            return matchesHost && isNotOriginalUrl
          })
          log.page(`Found ${outboundUrls.length} urls`)
          // this allows it to crawl pages that arent valid matches
          // but could lead back to valid pages
          // should have a flag to make stricter if desired
          log.page(`Valid path ${target.url}`)
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

          // only count it if it finds goodies
          if (contents.title || contents.body) {
            this.count++
            log.page(`Good contents. Total ${this.count}`)
          } else {
            log.page(`No contents found`)
          }
          // store crawl results
          this.db.store({
            outboundUrls,
            contents,
            radius: ++target.radius,
            url: target.url,
          })
        } catch (err) {
          log.page(
            `Error crawling url ${target.url}\n${err.message}\n${err.stack}`
          )
        }
      }
      if (this.count >= maxPages) {
        log.crawl(`Max pages reached! ${maxPages}`)
        break
      }
      target = this.db.shiftUrl()
    }

    log.crawl(`Crawler done, crawled ${this.count} pages`)
    browser.close()
    this.isRunning = false

    // return all items stored
    if (this.shouldCrawl) {
      return this.db.getAll()
    } else {
      return []
    }
  }

  getStatus() {
    return this.count
  }

  stop() {
    this.shouldCrawl = false
  }
}
