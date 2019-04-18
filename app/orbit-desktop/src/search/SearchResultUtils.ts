import { highlightText } from '@o/utils'
import { uniq } from 'lodash'

/**
 * SearchResult utility functions.
 */
export class SearchResultUtils {
  /**
   * Builds a search result title from a given bits titles.
   */
  static buildSearchResultTitle(titles: string[]): string {
    titles = titles.map(title => title.replace(/\n/g, ' ').trim())
    let title = uniq(titles).join(', ')
    if (title.length > 20) {
      title = title.substr(0, 17) + '...'
    }
    return title
  }

  /**
   * Builds a search result text from a given bits bodies.
   */
  static buildSearchResultText(keyword: string, texts: string[]): string {
    return uniq(
      texts.map(text => {
        text = text.replace(/\n/g, ' ').trim()
        return highlightText({
          text,
          words: [keyword],
          trimWhitespace: true,
          noSpans: true,
          maxChars: 20,
          maxSurroundChars: 10,
        })
      }),
    ).join(', ')
  }
}
