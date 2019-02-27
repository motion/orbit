import { Logger } from '@mcro/logger'
import { BitEntity, WebsiteApp } from '@mcro/models'
import { getRepository } from 'typeorm'
import { AppSyncer } from '../../core/AppSyncer'
import { WebsiteBitFactory } from './WebsiteBitFactory'
import { WebsiteCrawler } from './WebsiteCrawler'

/**
 * Syncs crawled websites.
 */
export class WebsiteSyncer implements AppSyncer {
  private app: WebsiteApp
  private log: Logger
  private crawler: WebsiteCrawler
  private bitFactory: WebsiteBitFactory

  constructor(app: WebsiteApp, log?: Logger) {
    this.app = app
    this.log = log || new Logger('syncer:crawler:' + app.id)
    this.crawler = new WebsiteCrawler(this.log)
    this.bitFactory = new WebsiteBitFactory(app)
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
      url: this.app.data.values.url,
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
