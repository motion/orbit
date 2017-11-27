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
import OS from 'os'

const MAX_CORES_DEFAULT = OS.cpus().length - 1

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
  cancelled = false
  isRunning = false
  browser = null
  count = 0
  selectors = null
  promiseEnds = []

  constructor(options: Options) {
    this.options = options || {}
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
        const { anchorNode } = document.getSelection()
        if (!anchorNode) {
          continue
        }
        titleEl = anchorNode.parentNode
        if (titleEl.tagName[0] !== 'H') {
          continue
        }
        titleSelector = titleEl.classList[0]
          ? titleEl.classList[0].toString().trim()
          : null
      }

      window.getSelection().empty()
      window.find(content)
      const { anchorNode } = document.getSelection()
      if (anchorNode) {
        const contentParent = document.getSelection().anchorNode.parentNode
          .parentNode
        const contentSelector = contentParent.classList[0]
          ? contentParent.classList[0].toString().trim()
          : null

        return (
          contentSelector &&
          titleSelector && { title: titleSelector, content: contentSelector }
        )
      }
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
        log.crawl(`skipping: ${url} doesn't have class .${this.articleClasses}`)
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
    if (!result) {
      return null
    }
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

  async validContentType(url) {
    const res = await fetch(url, { method: 'HEAD' })
    const contentType =
      res.headers.get('content-type') || res.headers.get('Content-Type')
    if (!contentType || !/text\/(html|xml)/g.test(contentType)) {
      log.page(`Bad content-type: ${res.headers.get('content-type')} ${url}`)
      return false
    }
    return true
  }

  async findLinks(page, { target, initialUrl, matchesDepth, entryUrl }) {
    const links = await page.evaluate(() => {
      const val = Array.from(document.querySelectorAll('[href]')).map(
        link => link.href
      )
      return val
    })
    return uniq(
      links
        .filter(x => x !== null)
        .map(cleanUrlHash)
        .map(href => normalizeHref(target.url, href))
    ).filter(link => {
      const parsed = parse(link)
      const noPrefix = s => s.replace(/www\./, '')
      const isNotOriginalUrl = link !== initialUrl
      return (
        isNotOriginalUrl &&
        matchesDepth(link) &&
        noPrefix(parsed.host) === noPrefix(entryUrl.host)
      )
    })
  }

  async start(entry: string, runOptions: Options = this.options) {
    if (!entry) {
      throw new Error('No entry given!')
    }
    this.count = 0
    this.isRunning = true
    this.cancelled = false
    log.crawl('Starting crawler')
    // merge options
    const options = {
      ...this.options,
      ...runOptions,
    }
    // options.queue for preset queue
    this.db = new CrawlerDB({
      queue: options.queue,
      disableLinkFinding: options.disableLinkFinding,
    })
    // defaults
    const {
      maxCores = MAX_CORES_DEFAULT,
      maxPages = Infinity,
      maxRadius = Infinity,
      // maxOffPathRadius, this would be really nice
      depth = '/',
      filterUrlExtensions = FILTER_URL_EXTENSIONS,
    } = options

    const matchesDepth = url => {
      return parse(url).pathname && parse(url).pathname.indexOf(depth) === 0
    }

    const initialUrl = cleanUrlHash(entry)
    let target = { url: initialUrl, radius: 0 }

    if (!target.url) {
      log.crawl(`no url: ${target.url}`)
      return
    }

    const entryUrl = parse(target.url)
    const fullMatchUrl = `${entryUrl.protocol}//${entryUrl.host}${depth}`

    log.crawl('Scoring closest to url:', fullMatchUrl)
    this.db.setScoringFn(url => urlSimilarity(fullMatchUrl, url))

    // used to check if done in while loop and after page crash
    const isFinished = checkQueue => {
      const isLoadingPage = loadingPage.indexOf(true) > -1
      const hasMoreInQueue = this.db.pageQueue.length > 0
      const hasFoundEnough = this.count >= maxPages
      const queueEmpty = !isLoadingPage && !hasMoreInQueue
      if (checkQueue) {
        if (this.cancelled) log.crawl('isFinished => cancelled')
        if (hasFoundEnough) log.crawl('isFinished => hasFoundEnough')
        if (queueEmpty) log.crawl('isFinished => queueEmpty')
      }
      return this.cancelled || hasFoundEnough || (checkQueue && queueEmpty)
    }

    const runTarget = async (target, page) => {
      log.page(`now: ${target.url}`)
      try {
        if (urlMatchesExtensions(target.url, filterUrlExtensions)) {
          log.page(`Looks like an image, avoid`)
          return null
        } else if (target.radius >= maxRadius) {
          log.page(`Maximum radius reached. Radius: ${target.radius}`)
          return null
        } else if (!matchesDepth(target.url)) {
          log.page(`Path is not at same depth:`)
          log.page(`  ${parse(target.url).pathname}`)
          log.page(`  ${depth}`)
          return null
        }
        // content-type whitelist
        if (!await this.validContentType(target.url)) {
          return null
        }
        await page.goto(target.url, {
          waitUntil: 'domcontentloaded',
        })
        if (this.cancelled) {
          log.page(`Cancelled during page process`)
          return null
        }
        const contents = await this.parse(page, target.url)
        if (this.cancelled) {
          log.page(`Cancelled during page process`)
          return null
        }
        let outboundUrls
        if (!options.disableLinkFinding) {
          outboundUrls = await this.findLinks(page, {
            target,
            initialUrl,
            matchesDepth,
            entryUrl,
          })
          log.page(`Found ${outboundUrls.length} urls`)
        }
        // only count it if it finds goodies
        if (contents) {
          log.page(
            `Found ${contents.title}, body len: ${contents.content.length}`
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
        if (!isFinished()) {
          log.page(
            `Error crawling url ${target.url}\n${err.message}\n${err.stack}`
          )
        }
        return null
      }
    }

    // if only running on 1 open 1 tab
    const concurrentTabs = Math.min(maxCores, 7)
    const startTime = +Date.now()
    const loadingPage = range(concurrentTabs).map(() => false)
    const browser = await puppeteer.launch(options.puppeteerOptions)
    const pages = await Promise.all(loadingPage.map(() => browser.newPage()))

    // handlers for after loaded a page
    const finishProcessing = tabIndex => {
      return result => {
        this.db.store(result)
        if (result && result.contents) {
          log.step('Downloaded', this.db.getValid().length, 'pages')
          this.count++
        }
        loadingPage[tabIndex] = false
      }
    }

    // do first one
    await runTarget(target, pages[0]).then(finishProcessing(0))

    const shouldCrawlMoreThanOne = maxPages > 1
    // start rest
    if (shouldCrawlMoreThanOne) {
      while (!isFinished(true)) {
        // throttle
        await sleep(20)
        // may need to wait for a tab to clear up
        const tabIndex = loadingPage.indexOf(false)
        if (tabIndex === -1) {
          continue
        }
        const target = this.db.shiftUrl()
        if (!target) {
          // could be processing a page that will fill queue once done
          continue
        }
        loadingPage[tabIndex] = true
        runTarget(target, pages[tabIndex]).then(finishProcessing(tabIndex))
      }
    }

    log.crawl(`Crawler done, crawled ${this.count} pages`)
    log.crawl(`took ${(+Date.now() - startTime) / 1000} seconds`)
    this.isRunning = false
    // close pages
    await browser.close()
    // resolve any cancels
    if (this.promiseEnds.length) {
      this.promiseEnds.forEach(resolve => resolve())
      this.promiseEnds = []
    }
    // return empty on cancel
    if (this.cancelled) {
      return null
    }
    // return results
    return this.db.getValid()
  }

  getStatus({ includeResults = false } = {}) {
    const res = { count: this.count, isRunning: this.isRunning }
    if (includeResults) {
      const results = this.db.getValid()
      // only show results if we have more than 0
      if (results && results.length) {
        res.results = results
      }
    }
    return res
  }

  // returns true if it was running
  stop() {
    this.cancelled = true
    if (!this.isRunning) {
      return Promise.resolve(false)
    }
    return new Promise(resolve => {
      this.promiseEnds.push(() => resolve(true))
    })
  }
}
