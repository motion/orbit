import { AppBit, Bit } from '@o/kit'
import { WorkerUtilsInstance } from '@o/worker-kit'

import { WebsiteBitData, WebsiteCrawledData } from './WebsiteModels'

/**
 * Creates a website Bit.
 */
export class WebsiteBitFactory {
  constructor(private app: AppBit, private utils: WorkerUtilsInstance) {}

  /**
   * Builds a bit from the given crawled data.
   */
  create(crawledData: WebsiteCrawledData): Bit {
    const bitCreatedAt = new Date().getTime()
    const bitUpdatedAt = new Date().getTime()
    const data: WebsiteBitData = {
      url: crawledData.url,
      title: crawledData.title,
      content: crawledData.content,
    }

    // create or update a bit
    return this.utils.createBit({
      type: 'website',
      originalId: this.app.id + '_' + crawledData.url,
      title: crawledData.title,
      body: crawledData.textContent,
      data,
      webLink: crawledData.url,
      people: [],
      bitCreatedAt,
      bitUpdatedAt,
      crawled: true,
    })
  }
}
