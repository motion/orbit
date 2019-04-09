export interface WebsiteAppData {
  data: {}
  values: {
    url: string
  }
}

export interface WebsiteBitData {
  /**
   * Website page url.
   */
  url: string

  /**
   * Rendered page's title.
   */
  title: string

  /**
   * Html content of the rendered page.
   */
  content: string
}

/**
 * Crawled website data.
 * Used to create a bit from.
 */
export interface WebsiteCrawledData {
  url: string
  title: string
  textContent: string
  content: string
}