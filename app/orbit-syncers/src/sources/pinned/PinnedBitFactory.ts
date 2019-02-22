import { Bit, BitUtils, PinnedBitData } from '@mcro/models'
import { WebsiteCrawledData } from '../website/WebsiteCrawledData'

/**
 * Creates a Bit for pinned url.
 */
export class PinnedBitFactory {
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
        Source: 'pinned',
        type: 'website',
        title: crawledData.title,
        body: crawledData.textContent,
        data: {
          title: crawledData.title,
          content: crawledData.content,
        } as PinnedBitData,
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
      },
      'pinned_' + crawledData.url,
    )
  }
}
