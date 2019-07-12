import { uniq } from 'lodash'
import URI from 'urijs'

/**
 * Crawl a website.
 */
export class WebsiteCrawlerUtils {
  /**
   * List of extensions found in a link that are disallowed for querying.
   */
  private static disallowedExtensions = ['.png', '.jpg', '.gif', '.css', '.js', '.svg', '.xml']

  /**
   * Normalizes links in crawler, removes all '/', '#', duplicates, etc.
   */
  static normalizeLinks(links: string[], baseUrl: string): string[] {
    // make sure we don't have empty links
    links = links.filter(link => !!link)

    // get rid of '#', for example https://www.economist.com/#
    links = links.map(val => val.replace(/[#](.*)$/g, ''))

    // some links on page are relative, e.g. /1. We need to apply their base
    links = links.map(link => {
      let url = new URI(link)
      if (url.is('relative')) {
        url = url.absoluteTo(baseUrl)
      }
      return url.toString()
    })

    // make sure all links are http and https
    links = links.filter(link => {
      return (
        link.substr(0, 'http://'.length) === 'http://' ||
        link.substr(0, 'https://'.length) === 'https://'
      )
    })

    // replace www. prefix
    links = links.map(link => {
      if (link.substr(0, 'http://www.'.length) === 'http://www.') {
        return 'http://' + link.substr(link.indexOf('http://www.') + 'http://www.'.length)
      }
      if (link.substr(0, 'https://www.'.length) === 'https://www.') {
        return 'https://' + link.substr(link.indexOf('https://www.') + 'https://www.'.length)
      }
      return link
    })

    // make sure its original link start with a given base url
    const replaceBaseMismatch = link =>
      link
        .replace('http://www.', '')
        .replace('https://www.', '')
        .replace('http://', '')
        .replace('https://', '')
    const normalizedBaseUrl = replaceBaseMismatch(baseUrl)
    links = links.filter(link => {
      // make sure link is sub-page of the original url
      const linkBase = replaceBaseMismatch(link).substr(0, normalizedBaseUrl.length)
      if (linkBase !== normalizedBaseUrl) return false

      return true
    })

    // filtering out
    links = links.filter(link => {
      // try to get an extension of the file in the link
      let extension = link.replace(/[?](.*)$/g, '').replace(/[#](.*)$/g, '')
      extension = extension.substr(extension.lastIndexOf('/') + 1)
      if (extension.lastIndexOf('.') !== -1) {
        extension = extension.substr(extension.lastIndexOf('.') + 1)
      }

      // disallow if that extension is in the list of disallowed extensions
      if (WebsiteCrawlerUtils.disallowedExtensions.indexOf(extension) !== -1) {
        return false
      }

      // otherwise we don't know what format it is, simply allow
      return true
    })

    // make sure all links are unique
    links = uniq(links)

    // finally return them back
    return links
  }
}
