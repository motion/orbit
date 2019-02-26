import { Bit, BitUtils, WebsiteApp, WebsiteBitData } from '@mcro/models'
import { WebsiteCrawledData } from './WebsiteCrawledData'

/**
 * Creates a website Bit.
 */
export class WebsiteBitFactory {
  private app: WebsiteApp

  constructor(app: WebsiteApp) {
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
    return BitUtils.create(
      {
        appType: 'website',
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
