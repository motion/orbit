import { Logger } from '@mcro/logger'
import { Bit, BitEntity, SettingEntity, WebsiteBitData } from '@mcro/models'
import { getRepository } from 'typeorm'
import { SourceSyncer } from '../../core/SourceSyncer'
import { BitSyncer } from '../../utils/BitSyncer'
import { WebsiteCrawler } from '../website/WebsiteCrawler'
import { PinnedBitFactory } from './PinnedBitFactory'

/**
 * Crawls pinned websites.
 */
export class PinnedUrlsSyncer implements SourceSyncer {
  private log: Logger
  private crawler: WebsiteCrawler
  private bitFactory: PinnedBitFactory
  private bitSyncer: BitSyncer

  constructor() {
    this.log = new Logger('syncer:pinned-urls')
    this.crawler = new WebsiteCrawler(this.log)
    this.bitFactory = new PinnedBitFactory()
    this.bitSyncer = new BitSyncer(undefined, this.log)
  }

  /**
   * Runs synchronization process.
   */
  async run() {
    // load person because we need emails that we want to whitelist
    this.log.info('loading general settings')
    const setting = await getRepository(SettingEntity).findOne({
      name: 'general',
    })
    this.log.info('general settings were loaded', setting)

    // load not crawled website bits
    const websiteBits = await getRepository(BitEntity).find({
      type: 'website',
      crawled: false,
    })

    // check if we have any pinned url or not crawled website bits
    if ((!setting.values.pinnedUrls || !setting.values.pinnedUrls.length) && !websiteBits.length) {
      this.log.info('no pinned urls or not crawled bits found, skipping')
      return
    }

    // launch browser to start crawl
    this.log.timer('launch browser')
    await this.crawler.start()
    this.log.timer('launch browser')

    // crawl urls
    if (setting.values.pinnedUrls && setting.values.pinnedUrls.length) {
      const apiBits: Bit[] = []
      this.log.timer('crawl pinned urls')
      for (let url of setting.values.pinnedUrls) {
        this.log.info('crawling', url)
        await this.crawler.run({
          url: url,
          deep: false,
          handler: async data => {
            apiBits.push(this.bitFactory.create(data))
            return true
          },
        })
      }
      this.log.timer('crawl pinned urls', apiBits)

      // sync bits
      const dbBits = await getRepository(BitEntity).find({
        sourceType: 'pinned',
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
}
