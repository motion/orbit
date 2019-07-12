/*
import { Logger } from '@o/kit'
import {
  Bit,
  BitEntity,
  createBit,
  PinnedBitData,
  WebsiteBitData,
} from '@o/kit'
import { getRepository } from 'typeorm'
import { BitSyncer } from '@o/worker-kit'
import { WebsiteCrawledData } from '../../../../apps/src/apps/website/WebsiteCrawledData'
import { WebsiteCrawler } from '../../../../apps/src/apps/website/WebsiteCrawler'

/!**
 * Crawls pinned websites.
 *!/
export class PinnedUrlsSyncer {
  private log: Logger
  private crawler: WebsiteCrawler
  private bitSyncer: BitSyncer

  constructor() {
    this.log = new Logger('syncer:pinned-urls')
    this.crawler = new WebsiteCrawler(this.log)
    this.bitSyncer = new BitSyncer(undefined, this.log)
  }

  /!**
   * Runs synchronization process.
   *!/
  async run() {
    // load person because we need emails that we want to whitelist
    this.log.info('loading general settings')
    const user = await getRepository(UserEntity).findOne()
    this.log.info('general users were loaded', user)

    // load not crawled website bits
    const websiteBits = await getRepository(BitEntity).find({
      type: 'website',
      crawled: false,
    })

    // check if we have any pinned url or not crawled website bits
    if ((!user.settings.pinnedUrls || !user.settings.pinnedUrls.length) && !websiteBits.length) {
      this.log.info('no pinned urls or not crawled bits found, skipping')
      return
    }

    // launch browser to start crawl
    this.log.timer('launch browser')
    await this.crawler.start()
    this.log.timer('launch browser')

    // crawl urls
    if (user.settings.pinnedUrls && user.settings.pinnedUrls.length) {
      const apiBits: Bit[] = []
      this.log.timer('crawl pinned urls')
      for (let url of user.settings.pinnedUrls) {
        this.log.info('crawling', url)
        await this.crawler.run({
          url: url,
          deep: false,
          handler: async data => {
            apiBits.push(this.createWebsiteBit(data))
            return true
          },
        })
      }
      this.log.timer('crawl pinned urls', apiBits)

      // sync bits
      const dbBits = await getRepository(BitEntity).find({
        appIdentifier: 'pinned',
      })
      await this.bitSyncer.sync({ apiBits, dbBits })
    }

    // update website bits
    if (websiteBits.length) {
      for (let bit of websiteBits) {
        const bitData = bit.data as WebsiteBitData
        this.log.info('crawling', bitData.url)
        await this.crawler.run({
          url: bitData.url,
          deep: false,
          handler: async data => {
            bitData.content = data.content
            bitData.title = data.title
            bit.crawled = true
            await getRepository(BitEntity).save(bit)
            return true
          },
        })
      }
    }

    // close browser
    await this.crawler.close()
  }

  /!**
   * Builds a bit from the given crawled data.
   *!/
  private createWebsiteBit(crawledData: WebsiteCrawledData): Bit {
    const bitCreatedAt = new Date().getTime()
    const bitUpdatedAt = new Date().getTime()
    // const values = this.source.values as CrawlerSettingValues

    // create or update a bit
    return createBit(
      {
        appIdentifier: 'pinned',
        type: 'website',
        title: crawledData.title,
        body: crawledData.textContent,
        data: {
          title: crawledData.title,
          content: crawledData.content,
        } as PinnedBitData,
        webLink: crawledData.url,
        people: [],
        bitCreatedAt,
        bitUpdatedAt,
      },
      'pinned_' + crawledData.url,
    )
  }
}
*/
