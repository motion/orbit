import { Logger } from '@mcro/logger'
import { WebsiteSource } from '@mcro/models'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { BitSyncer } from '../../utils/BitSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'
import { WebsiteBitFactory } from './WebsiteBitFactory'
import { WebsiteCrawler } from './WebsiteCrawler'

/**
 * Syncs crawled websites.
 */
export class WebsiteSyncer implements IntegrationSyncer {
  private log: Logger
  private crawler: WebsiteCrawler
  private bitFactory: WebsiteBitFactory
  private bitSyncer: BitSyncer
  private syncerRepository: SyncerRepository

  constructor(source: WebsiteSource, log?: Logger) {
    this.log = log || new Logger('syncer:crawler:' + source.id)
    this.crawler = new WebsiteCrawler(source, this.log)
    this.bitFactory = new WebsiteBitFactory(source)
    this.bitSyncer = new BitSyncer(source, this.log)
    this.syncerRepository = new SyncerRepository(source)
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {
    // load database data
    this.log.timer('load bits from the database')
    const dbBits = await this.syncerRepository.loadDatabaseBits()
    this.log.timer('load bits from the database', { dbBits })

    // load users from jira API
    this.log.timer('crawl site')
    const crawledData = await this.crawler.run()
    this.log.timer('crawl site', crawledData)

    // create bits from them and save them
    const apiBits = crawledData.map(crawledData => this.bitFactory.create(crawledData))
    await this.bitSyncer.sync({ apiBits, dbBits })
  }
}
