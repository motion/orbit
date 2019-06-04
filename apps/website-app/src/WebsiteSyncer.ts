import { createWorker } from '@o/worker-kit'

import { WebsiteBitFactory } from './WebsiteBitFactory'
import { WebsiteCrawler } from './WebsiteCrawler'

/**
 * Syncs crawled websites.
 */
export const WebsiteSyncer = createWorker(async ({ app, log, utils }) => {
  const crawler = new WebsiteCrawler(log)
  const bitFactory = new WebsiteBitFactory(app, utils)

  // load database data
  // log.timer('load bits from the database')
  // const dbBits = await syncerRepository.loadBits({ idsOnly: true })
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
