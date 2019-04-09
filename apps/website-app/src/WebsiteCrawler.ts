import { Logger } from '@o/kit'
import * as fs from 'fs'
import { WebsiteCrawlerUtils } from './WebsiteCrawlerUtils'
import { WebsiteCrawledData } from './WebsiteModels'

const puppeteer = require('puppeteer')
const getUrls = require('get-urls')

// todo(nate): make sure such paths works in prod mode
const filename = require.resolve('node-readability')
const readabilityLibrary = fs.readFileSync(filename, { encoding: 'utf-8' })
const readabilityCode = `(function(){
  try {
    ${readabilityLibrary};
    return new Readability(document).parse();

  } catch (err) {
    return err.toString();
  }
})();`

/**
 * Crawl a website options.
 */
export interface WebsiteCrawlerOptions {
  url: string
  deep: boolean
  handler: (data: WebsiteCrawledData) => Promise<boolean> | boolean
}

/**
 * Crawl a website.
 */
export class WebsiteCrawler {
  private log: Logger
  private visitedLinks: string[] = []
  private maxLinks = 100
  private browser: any

  constructor(log: Logger) {
    this.log = log
  }

  /**
   * Checks if browser is opened.
   */
  isOpened(): boolean {
    return !!this.browser
  }

  /**
   * Starts the browser to crawl websites data.
   */
  async start(): Promise<void> {
    this.log.timer('launch browser')
    if (this.browser) {
      await this.close()
    }
    this.browser = await puppeteer.launch({
      // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      // userDataDir: '/Users/pleerock/Library/Application Support/Google/Chrome',
      ignoreHTTPSErrors: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--user-data-dir=/Users/pleerock/Library/Application Support/Google/Chrome',
      ],
    })
    this.log.timer('launch browser')
  }

  /**
   * Closes the opened browser.
   */
  async close(): Promise<void> {
    if (this.browser) {
      this.browser.close()
      this.browser = null
    }
  }

  /**
   * Runs crawling process.
   */
  async run(options: WebsiteCrawlerOptions): Promise<void> {
    this.log.timer('crawl site')
    const page = await this.browser.newPage()
    this.visitedLinks.push(options.url)
    await this.visit(page, options.url, options)
    this.log.timer('crawl site')
  }

  /**
   * Visits and crawls given url.
   */
  private async visit(page: any, url: string, options: WebsiteCrawlerOptions) {
    this.log.verbose('visiting', url, options)
    try {
      // open given url
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 100000,
      })
      await page.waitFor(1000)
    } catch (err) {
      this.log.warning("couldn't open this link", err)
      return
    }

    // get page content
    let result = await page.evaluate(readabilityCode)
    if (!result) {
      const title = await page.title()
      const content = await page.content()
      result = {
        url,
        title,
        content,
        textContent: content,
      }
    }

    // create a final website data object and call handler function
    const data: WebsiteCrawledData = {
      url,
      title: result.title,
      textContent: result.textContent,
      content: result.content,
    }
    const handleResult = await options.handler(data)

    // if callback returned true we don't continue syncing
    if (handleResult === false) {
      this.log.info('stopped issues syncing, no need to sync more', data)
      return // return from the function, we don't need to crawl more links
    }

    this.log.verbose(`crawled ${result.title} ${this.visitedLinks.length}`, result)

    // if deep crawl is enabled - do it
    if (options.deep) {
      // get links we need to traverse to get content of
      let links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')) // get all <a href links
          .map(val => val.href) // extract href from links
          .filter(val => !!val)
      })
      this.log.verbose('found links', links)

      // if for some reason we didn't receive links (example: https://help.uber.com/)
      // we get links from the html content
      if (!links.length) {
        this.log.verbose('no links found, trying to find it right from the html content')
        links = Array.from((getUrls(data.content) as Set<string>).values())
        this.log.verbose('found links from html content', links)
      }

      // normalize links and cut them out
      links = WebsiteCrawlerUtils.normalizeLinks(links, url)

      // remove visited links from new links array
      links = links.filter(link => this.visitedLinks.indexOf(link) === -1)

      // make sure number of links doesn't exceed max number of crawled links
      if (this.visitedLinks.length + links.length >= this.maxLinks) {
        links = links.slice(0, this.maxLinks - this.visitedLinks.length)
      }
      this.visitedLinks.push(...links)

      this.log.verbose('filtered, normalized and removed duplicate links', links)
      // visit each link
      for (let link of links) {
        await this.visit(page, link, options)
      }
    }
  }
}
