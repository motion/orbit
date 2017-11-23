// @flow
import 'isomorphic-fetch'
import { parse } from 'url'
import puppeteer from 'puppeteer'
import debug from 'debug'
import CrawlerDB from './crawlerDB'
import type { Options } from '~/types'
import { uniq, range } from 'lodash'
import readabilityFromString from 'readability-from-string'
import upndown from 'upndown'
import URI from 'urijs'
import sanitizeHtml from 'sanitize-html'
import { writeFileSync } from 'fs'

const normalizeHref = (baseUrl, href) => {
  let url = new URI(href)
  if (url.is('relative')) {
    url = url.absoluteTo(baseUrl)
  }
  return url.toString()
}

const sleep = ms => new Promise(res => setTimeout(res, ms))

const und = new upndown()

const log = {
  crawl: debug('crawler:crawl'),
  page: debug('crawler:page'),
  step: debug('crawler:step'),
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
  hasFinished = false

  count = 0
  selectors = null

  constructor(options: Options) {
    this.options = options
  }

  textToSelectors = async (page, contents) => {
    return await page.evaluate(({ title, content }) => {
      let foundTitle = false
      let tries = 0

      let titleEl = null
      let titleSelector = null
      while (!foundTitle && tries++ < 3) {
        window.find(title)
        // select first class because it didn't work on any of my
        // test cases with all of them
        titleEl = document.getSelection().anchorNode.parentNode
        if (titleEl.tagName[0] !== 'H') continue

        titleSelector = titleEl.classList[0]
          ? titleEl.classList[0].toString().trim()
          : null
      }

      window.getSelection().empty()
      window.find(content)
      const contentParent = document.getSelection().anchorNode.parentNode
        .parentNode
      const contentSelector = contentParent.classList[0]
        ? contentParent.classList[0].toString().trim()
        : null

      return (
        contentSelector &&
        titleSelector && { title: titleSelector, content: contentSelector }
      )
    }, contents)
  }

  parse = async (page, url) => {
    let selectorResults = null

    if (this.selectors) {
      selectorResults = await page.evaluate(classes => {
        const titles = Array.from(
          document.querySelectorAll('.' + classes.title)
        )
        const content = Array.from(
          document.querySelectorAll('.' + classes.content)
        )
          .filter(_ => _)
          .map(_ => _.innerText)
          .join('\n')

        if (titles.length === 0 || titles.length > 1) {
          return null
        }

        return { title: titles[0].innerText, content }
      }, this.selectors)

      if (!selectorResults) {
        log.crawl(
          'skipping because ',
          url,
          'does not contain class .',
          this.articleClasses
        )
        return null
      }
    }

    const html = await page.evaluate(() => {
      // some kbs have error pages that are hidden in the dom
      Array.from(document.querySelectorAll('.hide, .hidden, .error')).forEach(
        _ => _.remove()
      )
      return document.documentElement.outerHTML
    })

    const result =
      selectorResults ||
      readabilityFromString(sanitizeHtml(html, { allowedTags: false }), {
        href: url,
      })

    if (!result) return null

    const md = await new Promise(res => {
      und.convert(result.content, (err, md) => res(md))
    })

    if (result && !this.selectors) {
      this.selectors = await this.textToSelectors(page, {
        title: result.title.slice(0, 15),
        content: md.slice(0, 30),
      })
      log.crawl('set classes to ' + JSON.stringify(this.selectors))
    }

    return { title: result.title, content: md }
  }

  selectorParse = async (page, options) => {
    return await page.evaluate(async options => {
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
  }

  async writeFolder(path, pages) {
    pages.forEach(page => {
      writeFileSync(`${path}/${page.contents.title}.txt`, page.contents.content)
    })
    return true
  }

  async start(entry: string, runOptions: Options = this.options) {
    if (!entry) {
      throw new Error('No entry given!')
    }
    this.db = new CrawlerDB()
    this.count = 0
    this.isRunning = true
    this.hasFinished = false
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

    const entryUrl = parse(target.url)
    const fullMatchUrl = `${entryUrl.protocol}//${entryUrl.host}${depth}`

    log.crawl('scoring closest to url:', fullMatchUrl)
    this.db.setScoringFn(url => urlSimilarity(fullMatchUrl, url))

    const browser = await puppeteer.launch(puppeteerOptions)
    // const page = await browser.newPage()

    const runTarget = async (target, page) => {
      if (urlMatchesExtensions(target.url, filterUrlExtensions)) {
        log.page(`Looks like an image, avoid ${target.url}`)
        return null
      } else if (target.radius >= maxRadius) {
        log.page(
          `Maximum radius reached, did not crawl ${target.url} with radius ${
            target.radius
          }`
        )
        return null
      } else {
        const isValidPath = matchPath(target.url)

        if (!isValidPath) {
          log.page(`Path is not at same depth:`)
          log.page(`  ${parse(target.url).pathname}`)
          log.page(`  ${depth}`)
          return null
        }
      }
      // content-type whitelist
      const res = await fetch(target.url, { method: 'HEAD' })
      const contentType =
        res.headers.get('content-type') || res.headers.get('Content-Type')

      if (!contentType || !/text\/(html|xml)/g.test(contentType)) {
        log.page(
          `Bad content-type: ${res.headers.get('content-type')} ${target.url}`
        )
        return null
      }

      log.page(`Crawling ${target.url}`)
      try {
        await page.goto(target.url, {
          waitUntil: 'domcontentloaded',
        })

        const contents = await this.parse(page, target.url)

        const links = await page.evaluate(() => {
          const val = Array.from(document.querySelectorAll('[href]')).map(
            link => link.href
          )
          return val
        })

        let outboundUrls = uniq(
          links
            .filter(x => x !== null)
            .map(cleanUrlHash)
            .map(href => normalizeHref(target.url, href))
        )
          .filter(x => x !== null)
          .filter(link => {
            const parsed = parse(link)
            const noPrefix = s => s.replace(/www\./, '')
            const isNotOriginalUrl = link !== initialUrl
            return (
              isNotOriginalUrl &&
              matchPath(link) &&
              noPrefix(parsed.host) === noPrefix(entryUrl.host)
            )
          })

        log.page(`Found ${outboundUrls.length} urls`)
        // this allows it to crawl pages that arent valid matches
        // but could lead back to valid pages
        // should have a flag to make stricter if desired
        log.page(`Valid path ${target.url}`)

        // only count it if it finds goodies
        if (contents) {
          log.page(
            `Good contents. Total ${this.count}. Crawled ${
              contents.title
            } which has ${contents.content.length} characters.`
          )
        } else {
          log.page(`No contents found`)
        }
        // store crawl results
        return {
          outboundUrls,
          contents,
          radius: ++target.radius,
          url: target.url,
        }
      } catch (err) {
        log.page(
          `Error crawling url ${target.url}\n${err.message}\n${err.stack}`
        )
      }
    }

    const concurrentTabs = 3
    const startTime = +Date.now()

    const openPages = range(concurrentTabs).map(_ => true)
    const pages = await Promise.all(
      openPages.map(async _ => await browser.newPage())
    )
    this.db.store(await runTarget(target, pages[0]))
    await sleep(50)

    while (!this.hasFinished) {
      const openIndex = openPages.indexOf(true)
      if (openIndex !== -1) {
        const target = this.db.shiftUrl()
        if (target !== null) {
          openPages[openIndex] = false
          runTarget(target, pages[openIndex]).then(val => {
            openPages[openIndex] = true
            if (val) {
              log.step('Downloaded ', this.db.getValid().length, 'pages')
              if (
                openPages.indexOf(false) === -1 &&
                this.db.pageQueue.length === 0
              ) {
                this.hasFinished = true
              }
              this.db.store(val)
              if (val.contents) {
                this.count++
              }
            }
          })
        }
      }
      await sleep(20)

      if (this.count >= maxPages) {
        log.crawl(`Max pages reached! ${maxPages}`)
        break
      }
    }

    log.crawl(`Crawler done, crawled ${this.count} pages`)
    log.crawl(`took ${(+Date.now() - startTime) / 1000} seconds`)

    // await this.writeFolder('./out', this.db.getValid())
    this.isRunning = false

    // return all items stored
    if (this.shouldCrawl) {
      return this.db.getValid()
    } else {
      return []
    }
  }

  crawlForSelectors() {}

  getStatus() {
    return { count: this.count, isRunning: this.isRunning }
  }

  stop() {
    this.hasFinished = false
  }
}
