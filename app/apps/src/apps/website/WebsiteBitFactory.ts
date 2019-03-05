import { AppBit, Bit } from '@mcro/models'
import { WebsiteCrawledData } from './WebsiteCrawledData'
import { WebsiteBitData } from './WebsiteBitData'
import { createBit } from '@mcro/sync-kit'

/**
 * Creates a website Bit.
 */
export class WebsiteBitFactory {
  private app: AppBit

  constructor(app: AppBit) {
    this.app = app
  }

  /**
   * Builds a bit from the given crawled data.
   */
  create(crawledData: WebsiteCrawledData): Bit {
    const bitCreatedAt = new Date().getTime()
    const bitUpdatedAt = new Date().getTime()
    // const values = this.app.values as CrawlerSettingValues

    // create or update a bit
    return createBit(
      {
        appIdentifier: 'website',
        appId: this.app.id,
        type: 'website',
        title: crawledData.title,
        body: crawledData.textContent,
        data: {
          url: crawledData.url,
          title: crawledData.title,
          content: crawledData.content,
        } as WebsiteBitData,
        // location: {
        //   id: undefined,
        //   name: undefined,
        //   webLink: undefined,
        //   desktopLink: undefined,
        // },
        webLink: crawledData.url,
        people: [],
        bitCreatedAt,
        bitUpdatedAt,
        crawled: true,
      },
      this.app.id + '_' + crawledData.url,
    )
  }
}
