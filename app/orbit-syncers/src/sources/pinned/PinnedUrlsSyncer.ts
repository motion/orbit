import { SettingEntity } from '@mcro/entities'
import { BitEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { Bit } from '@mcro/models'
import { getRepository } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { BitSyncer } from '../../utils/BitSyncer'
import { WebsiteCrawler } from '../website/WebsiteCrawler'
import { PinnedBitFactory } from './PinnedBitFactory'

/**
 * Crawls pinned websites.
 */
export class PinnedUrlsSyncer implements IntegrationSyncer {
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
      name: 'general'
    })
    this.log.info('general settings were loaded', setting)

    // check if we have any pinned url
    if (!setting.values.pinnedUrls || !setting.values.pinnedUrls.length) {
      this.log.info('no pinned urls found, skipping')
      return
    }

    // launch browser to start crawl
    this.log.timer('launch browser')
    await this.crawler.start()
    this.log.timer('launch browser')

    // crawl urls
    const apiBits: Bit[] = []
    this.log.timer('crawl pinned urls')
    for (let url of setting.values.pinnedUrls) {
      try {
        const [crawledData] = await this.crawler.run({
          url: url,
          deep: false
        })

        apiBits.push(this.bitFactory.create(crawledData))

      } catch (error) {
        this.log.warning(`cannot crawl pinned url`, url)
      }
    }
    this.log.timer('crawl pinned urls', apiBits)

    // close browser
    await this.crawler.close()

    // sync bits
    const dbBits = await getRepository(BitEntity).find({
      integration: 'pinned'
    })
    await this.bitSyncer.sync({ apiBits, dbBits })
  }
}
