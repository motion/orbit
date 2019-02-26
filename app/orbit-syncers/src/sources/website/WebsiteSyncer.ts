import { Logger } from '@mcro/logger'
import { BitEntity, WebsiteSource } from '@mcro/models'
import { getRepository } from 'typeorm'
import { AppSyncer } from '../../core/AppSyncer'
import { WebsiteBitFactory } from './WebsiteBitFactory'
import { WebsiteCrawler } from './WebsiteCrawler'

/**
 * Syncs crawled websites.
 */
export class WebsiteSyncer implements AppSyncer {
  private source: WebsiteSource
  private log: Logger
  private crawler: WebsiteCrawler
  private bitFactory: WebsiteBitFactory

  constructor(source: WebsiteSource, log?: Logger) {
    this.source = source
    this.log = log || new Logger('syncer:crawler:' + source.id)
    this.crawler = new WebsiteCrawler(this.log)
    this.bitFactory = new WebsiteBitFactory(source)
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {
    // load database data
    // this.log.timer('load bits from the database')
    // const dbBits = await this.syncerRepository.loadDatabaseBits()
    // this.log.timer('load bits from the database', { dbBits })

    // launch browser to start crawl
    this.log.timer('launch browser')
    await this.crawler.start()
    this.log.timer('launch browser')

    // crawl link
    this.log.timer('crawl site')
    await this.crawler.run({
      url: this.source.values.url,
      deep: true,
      handler: async data => {
        const bit = this.bitFactory.create(data)
        await getRepository(BitEntity).save(bit, { listeners: false })
        return true
      },
    })
    this.log.timer('crawl site')

    // close browser
    await this.crawler.close()
  }
}
