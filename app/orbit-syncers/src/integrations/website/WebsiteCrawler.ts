import { Logger } from '@mcro/logger'
import { WebsiteSetting } from '@mcro/models'
import { WebsiteCrawledData } from './WebsiteCrawledData'
import * as fs from 'fs'
import * as path from 'path'
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
 * Crawl a website.
 */
export class WebsiteCrawler {
  private setting: WebsiteSetting
  private log: Logger
  private visitedLinks: string[] = []
  private allData: WebsiteCrawledData[] = []
  private maxLinks = 100

  constructor(setting: WebsiteSetting, log: Logger) {
    this.setting = setting
    this.log = log
  }

  /**
   * Runs crawling process.
   */
  async run(): Promise<WebsiteCrawledData[]> {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    this.visitedLinks.push(this.setting.values.url)
    await this.visit(page, this.setting.values.url)
    await browser.close()
    return this.allData
  }

  /**
   * Visits and crawls given url.
   */
  private async visit(page: any, url: string) {
    this.log.verbose(`visiting`, url)
    try {

      // open given url
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 100000
      })

    } catch (err) {
      this.log.warning(`couldn't open this link`, err)
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
      return data.title === result.title &&
        data.content === result.content &&
        data.textContent === result.textContent
    })
    if (sameData) {
      this.log.info(`found page with same content, skip it`, { exist: sameData, new: result })
      return
    }

    this.allData.push({
      url,
      title: result.title,
      textContent: result.textContent,
      content: result.content,
    })
    this.log.verbose(`crawled ${result.title} (${this.allData.length}/${this.visitedLinks.length})`, result)

    // get links we need to traverse to get content of
    let links = await page.evaluate(() => {
      return Array
        .from(document.querySelectorAll('a')) // get all <a href links
        .map(val => val.href) // extract href from links
        .filter(val => !!val)
    })
    this.log.verbose("found links", links)

    // if for some reason we didn't receive links (example: https://help.uber.com/)
    // we get links from the html content
    if (!links.length) {
      this.log.verbose("no links found, trying to find it right from the html content")
      links = Array.from((getUrls(this.allData[this.allData.length - 1].content) as Set<string>).values())
      this.log.verbose("found links from html content", links)
    }

    // normalize links and cut them out
    links = WebsiteCrawlerUtils.normalizeLinks(links, url)

    // remove visited links from new links array
    links = links.filter(link => this.visitedLinks.indexOf(link) === -1)

    // make sure number of links doesn't exceed max number of crawled links
    if ((this.visitedLinks.length + links.length) >= this.maxLinks) {
      links = links.slice(0, this.maxLinks - this.visitedLinks.length)
    }
    this.visitedLinks.push(...links)

    this.log.verbose("filtered, normalized and removed duplicate links", links)
    // visit each link
    for (let link of links) {
      await this.visit(page, link)
    }
  }
}
