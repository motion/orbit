import { BitEntity } from '@o/models'
import { createSyncer, getEntityManager, isAborted } from '@o/sync-kit'
import { WebsiteBitFactory } from './WebsiteBitFactory'
import { WebsiteCrawler } from './WebsiteCrawler'

/**
 * Syncs crawled websites.
 */
export const WebsiteSyncer = createSyncer(async ({ app, log }) => {
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
      await isAborted(app)

      const bit = bitFactory.create(data)
      await getEntityManager()
        .getRepository(BitEntity)
        .save(bit, { listeners: false })
      return true
    },
  })
  log.timer('crawl site')

  // close browser
  await crawler.close()
})
