import { BitEntity, WebsiteApp } from '@mcro/models'
import { WebsiteBitFactory } from './WebsiteBitFactory'
import { WebsiteCrawler } from './WebsiteCrawler'
import { createSyncer } from '@mcro/sync-kit'

/**
 * Syncs crawled websites.
 */
export const WebsiteSyncer = createSyncer<WebsiteApp>(async ({ app, log, manager, isAborted }) => {

  const crawler = new WebsiteCrawler(log)
  const bitFactory = new WebsiteBitFactory(app)

  // load database data
  // log.timer('load bits from the database')
  // const dbBits = await syncerRepository.loadDatabaseBits()
  // log.timer('load bits from the database', { dbBits })

  // launch browser to start crawl
  log.timer('launch browser')
  await crawler.start()
  log.timer('launch browser')

  // crawl link
  log.timer('crawl site')
  await crawler.run({
    url: app.data.values.url,
    deep: true,
    handler: async data => {
      await isAborted()

      const bit = bitFactory.create(data)
      await manager.getRepository(BitEntity).save(bit, { listeners: false })
      return true
    },
  })
  log.timer('crawl site')

  // close browser
  await crawler.close()
  
})
