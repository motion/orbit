import { BitUtils } from '@mcro/model-utils'
import { Bit, Setting, WebsiteBitData } from '@mcro/models'
import { WebsiteCrawledData } from './WebsiteCrawledData'

/**
 * Creates a website Bit.
 */
export class WebsiteBitFactory {
  private setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  /**
   * Builds a bit from the given crawled data.
   */
  create(crawledData: WebsiteCrawledData): Bit {
    const bitCreatedAt = new Date().getTime()
    const bitUpdatedAt = new Date().getTime()
    // const values = this.setting.values as CrawlerSettingValues

    // create or update a bit
    return BitUtils.create({
      integration: 'website',
      setting: this.setting,
      type: 'website',
      title: crawledData.title,
      body: crawledData.textContent,
      data: {
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
    }, crawledData.url)
  }
}
