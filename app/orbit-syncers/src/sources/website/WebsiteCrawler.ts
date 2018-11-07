import { Logger } from '@mcro/logger'
import * as fs from 'fs'
import * as path from 'path'
import { WebsiteCrawledData } from './WebsiteCrawledData'
import { WebsiteCrawlerUtils } from './WebsiteCrawlerUtils'

const puppeteer = require('puppeteer')
const getUrls = require('get-urls')

// todo(nate): make sure such paths works in prod mode
const filename = path.resolve(__dirname + '/Readability.js')
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

}

/**
 * Crawl a website.
 */
export class WebsiteCrawler {
  private log: Logger
  private visitedLinks: string[] = []
  private allData: WebsiteCrawledData[] = []
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
        '--user-data-dir=/Users/pleerock/Library/Application Support/Google/Chrome'
      ],
    })
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
  async run(options: WebsiteCrawlerOptions): Promise<WebsiteCrawledData[]> {
    const page = await this.browser.newPage()
    this.visitedLinks.push(options.url)
    await this.visit(page, options.url, options)
    return this.allData
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
      await page.waitFor(1000);
    } catch (err) {
      this.log.warning('couldn\'t open this link', err)
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

    // exclude absolutely identical content
    const sameData = this.allData.find(data => {
      return (
        data.title === result.title &&
        data.content === result.content &&
        data.textContent === result.textContent
      )
    })
    if (sameData) {
      this.log.info('found page with same content, skip it', { exist: sameData, new: result })
      return
    }

    this.allData.push({
      url,
      title: result.title,
      textContent: result.textContent,
      content: result.content,
    })
    this.log.verbose(
      `crawled ${result.title} (${this.allData.length}/${this.visitedLinks.length})`,
      result,
    )

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
        links = Array.from(
          (getUrls(this.allData[this.allData.length - 1].content) as Set<string>).values(),
        )
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
