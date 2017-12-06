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

// dont use last two cores if possible
// so on 4 core machine just use two
const MAX_CORES_DEFAULT = Math.max(1, OS.cpus().length - 2)

const removeMdPrefix = text => text.replace(/^[^a-zA-Z0-9]*[a-zA-Z0-9]/, '')
const normalizeHref = (baseUrl, href) => {
  let url = new URI(href)
  if (url.is('relative')) {
    url = url.absoluteTo(baseUrl)
  }
  return url.toString()
}
const sleep = ms => new Promise(res => setTimeout(res, ms))
const markdown = new upndown()
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

  selectors = null

  constructor(options: Options) {
    this.options = options || {}
  }

  selectorFinder = ({ title, content }) => {
    Array.from(
      document.querySelectorAll('.breadcrumbs, .crumbs, .breadcrumb')
    ).forEach(_ => _.remove())
    let tries = 0
    let current = null
    let titleSelector = null
    window.getSelection().empty()
    window.find(title)
    if (document.getSelection()) {
      const getTitleSelector = node => {
        const name = node.tagName.toLowerCase()
        if (name[0] === 'h' && name.length === 2) {
          return name
        }
        const TITLEY = /title|headline/
        if (TITLEY.test(node.id)) {
          return `#${node.id}`
        }
        const cn = node.className.split(' ').find(x => TITLEY.test(x))
        if (cn) {
          return `${name}.${cn.trim()}`
        }
      }
      const { anchorNode } = document.getSelection()
      current = anchorNode
      while (current && !titleSelector && tries++ < 3) {
        current = current.parentNode
        if (!current || !current.tagName) continue
        titleSelector = getTitleSelector(current)
      }
    }
    if (!titleSelector) {
      return null
    }
    // get content now
    window.getSelection().empty()
    window.find(content)
    if (document.getSelection()) {
      const getContentSelector = node => {
        const name = node.tagName.toLowerCase()
        if (name === 'article' || name === 'section') {
          return name
        }
        // bad
        if (/^(ul|li|a|ol)$/.test(name)) {
          return null
        }
        const CONTENTY = /content|article|post|body/
        if (CONTENTY.test(node.id)) {
          return `#${node.id}`
        }
        const cn = node.className.split(' ').find(x => CONTENTY.test(x))
        if (cn) {
          const selector = `${name}.${cn.trim()}`
          // this should narrow it a bit
          if (node.parentNode) {
            return `${node.parentNode.tagName.toLowerCase()} > ${selector}`
          }
          return selector
        }
      }
      const { anchorNode } = document.getSelection()
      let contentSelector = null
      current = anchorNode
      tries = 0
      while (current && !contentSelector && tries++ < 3) {
        current = current.parentNode
        if (!current || !current.tagName) continue
        // if we found a bad node, try again
        if (/^(H[1-6]|LI|A)$/.test(current.tagName)) {
          window.find(content)
          const nextNode = document.getSelection().anchorNode
          if (!nextNode) break
          current = current.parentNode
        }
        contentSelector = getContentSelector(current)
      }
      if (contentSelector) {
        return { titleSelector, contentSelector }
      }
    }
  }

  textToSelectors = async (page, contents) => {
    return await page.evaluate(this.selectorFinder, contents)
  }

  parseContents = async (page, url, options) => {
    let selectorResults = null
    // if we have selectors
    if (this.selectors) {
      log.page(`Using selectors: ${JSON.stringify(this.selectors)}`)
      selectorResults = await page.evaluate(selectors => {
        const titles = Array.from(
          document.querySelectorAll(selectors.titleSelector)
        )
        const content = Array.from(
          document.querySelectorAll(selectors.contentSelector)
        )
          .filter(Boolean)
          .map(_ => _.innerText)
          .join('\n')
        // dont allow index pages or untitled pages
        if (titles.length === 0 || titles.length > 1) {
          return null
        }
        return { title: titles[0].innerText, content }
      }, this.selectors)
      if (!selectorResults) {
        log.page(`skip: didn't find content with selectors`)
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
    let result = selectorResults
    if (!result) {
      result = readabilityFromString(
        sanitizeHtml(html, { allowedTags: false }),
        {
          href: url,
        }
      )
      if (!result) {
        log.page(`Readability didn't find anything`)
        return null
      }
    }
    let content
    if (!result.content) {
      log.page(`Readability didn't find any content`)
    } else {
      try {
        content = await new Promise((resolve, reject) => {
          markdown.convert(
            result.content,
            (err, md) => (err ? reject(err) : resolve(md))
          )
        })
        if (content) {
          log.page(`Got markdown: ${content.slice(0, 30)}...`)
        }
      } catch (err) {
        log.page(`Error parsing markdown from content: ${err.message}`)
      }
      if (!content) {
        content = sanitizeHtml(result.content, { allowedTags: [] })
        if (content) {
          log.page(`Sanitized for content: ${content.slice(0, 30)}...`)
        }
      }
    }
    if (!content) {
      log.page(`No content, looks like a dud`)
      return null
    }
    if (!options.disableStructureFinding && !this.selectors) {
      try {
        const contentString = sanitizeHtml(result.content, {
          allowedTags: [],
        }).trim()
        const contentPs = contentString.split('\n')
        const contentLastP = contentPs[contentPs.length - 1]
        const contentLastSentence = content
          .slice(Math.max(0, contentLastP.length - 30), contentLastP.length)
          .trim()
        console.log('contentLastSentence', contentLastSentence)
        this.selectors = await this.textToSelectors(page, {
          title: result.title.slice(0, 30),
          content: removeMdPrefix(contentLastSentence),
        })
      } catch (err) {
        log.page(`Error finding selectors: ${err.message}`)
      }
      if (this.selectors) {
        log.crawl('Selectors: ' + JSON.stringify(this.selectors))
      }
    }
    return { title: result.title, content }
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

  writeFolder = async (path, pages) => {
    pages.forEach(page => {
      writeFileSync(`${path}/${page.contents.title}.txt`, page.contents.content)
    })
    return true
  }

  validContentType = async url => {
    const res = await fetch(url, { method: 'HEAD' })
    const contentType =
      res.headers.get('content-type') || res.headers.get('Content-Type')
    if (!contentType || !/text\/(html|xml|plain)/g.test(contentType)) {
      log.page(`Bad content-type: ${res.headers.get('content-type')} ${url}`)
      return false
    }
    return true
  }

  findLinks = async (page, { target, initialUrl, matchesDepth, entryUrl }) => {
    const links = await page.evaluate(() => {
      const val = Array.from(document.querySelectorAll('[href]')).map(
        link => link.href
      )
      return val
    })
    log.page(`Raw links: ${links.length}`)
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

  start = async (entry: string, runOptions: Options = this.options) => {
    if (!entry) {
      throw new Error('No entry given!')
    }
    this.count = 0
    this.isRunning = true
    this.cancelled = false
    log.crawl('Starting crawler')
    // merge options
    const options = {
      puppeteerOptions: {
        ignoreHTTPSErrors: true,
        timeout: 10000, // 10 seconds
      },
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
        const contents = await this.parseContents(page, target.url, options)
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
          log.page(`Found urls: ${outboundUrls.length}`)
        }
        // only count it if it finds goodies
        if (contents) {
          log.page(
            `Found title (${contents.title}) body of ${
              contents.content.length
            } length`
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
            `Good contents. Total ${count}. Crawled ${
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

    let count = 0
    this.isRunning = true
    const concurrentTabs = 3
    const startTime = +Date.now()

    const openPages = range(concurrentTabs).map(_ => true)
    const pages = await Promise.all(
      openPages.map(async _ => await browser.newPage())
    )
    this.db.store(await runTarget(target, pages[0]))
    await sleep(50)

    let hasFinished = false

    while (!hasFinished) {
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
                hasFinished = true
              }
              this.db.store(val)
              if (val.contents) {
                count++
              }
            }
          })
        }
        return null
      }
    }

    // if only running on 1 open 1 tab
    const concurrentTabs = Math.min(maxCores, 7)
    const startTime = +Date.now()
    const loadingPage = range(concurrentTabs).map(() => false)
    log.crawl(
      `Using puppeteer options: ${JSON.stringify(options.puppeteerOptions)}`
    )
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

  getStatus = ({ includeResults = false } = {}) => {
    const res = { count: this.count, isRunning: this.isRunning }
    if (includeResults && this.db) {
      const results = this.db.getValid()
      // only show results if we have more than 0
      if (results && results.length) {
        res.results = results
      }
    }
    return res
  }

  // returns true if it was running
  stop = () => {
    this.cancelled = true
    if (!this.isRunning) {
      return Promise.resolve(false)
    }
    return new Promise(resolve => {
      this.promiseEnds.push(() => resolve(true))
      // failsafe
      setTimeout(() => {
        resolve(false)
      }, 5)
    })
  }
}
