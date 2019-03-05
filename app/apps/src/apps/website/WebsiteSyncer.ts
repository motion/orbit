import { WebsiteBitFactory } from './WebsiteBitFactory'
import { WebsiteCrawler } from './WebsiteCrawler'
import { createSyncer } from '@mcro/sync-kit'

/**
 * Syncs crawled websites.
 */
export const WebsiteSyncer = createSyncer(async ({ app, log, utils }) => {

  const crawler = new WebsiteCrawler(log)
  const bitFactory = new WebsiteBitFactory(app)

  // load database data
  // log.timer('load bits from the database')
  // const dbBits = await syncerRepository.loadDatabaseBits()
  // log.timer('load bits from the database', { dbBits })

  // launch browser to start crawl
  await crawler.start()

  // crawl link
  await crawler.run({
    url: app.data.values.url,
    deep: true,
    handler: async data => {
      await utils.isAborted()

      const bit = bitFactory.create(data)
      utils.saveBit(bit)
      return true
    },
  })

  // close browser
  await crawler.close()
  
})
