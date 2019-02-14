import { Bit, BitUtils, WebsiteBitData, WebsiteSource } from '@mcro/models'
import { WebsiteCrawledData } from './WebsiteCrawledData'

/**
 * Creates a website Bit.
 */
export class WebsiteBitFactory {
  private source: WebsiteSource

  constructor(source: WebsiteSource) {
    this.source = source
  }

  /**
   * Builds a bit from the given crawled data.
   */
  create(crawledData: WebsiteCrawledData): Bit {
    const bitCreatedAt = new Date().getTime()
    const bitUpdatedAt = new Date().getTime()
    // const values = this.source.values as CrawlerSettingValues

    // create or update a bit
    return BitUtils.create(
      {
        integration: 'website',
        sourceId: this.source.id,
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
      this.source.id + '_' + crawledData.url,
    )
  }
}
