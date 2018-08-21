import { ConfluenceContent } from './ConfluenceTypes'

const createDOMPurify = require('dompurify')
const JSDOM = require('jsdom').JSDOM
const window = (new JSDOM('')).window
const DOMPurify = createDOMPurify(window)

/**
 * Confluence syncer related utility functions.
 */
export class ConfluenceUtils {

  /**
   * Builds a text body of a given confluence content.
   */
  static buildTextBody(content: ConfluenceContent) {
    const html = content.body.styled_view.value
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
      .replace(/&nbsp;/gi, ' ')
      .replace(/•/gi, '')
      .trim()
  }

  /**
   * Builds a clean html body of a given confluence content.
   */
  static buildHtmlBody(content: ConfluenceContent) {
    const html = content.body.styled_view.value
    let cleanHtml = DOMPurify.sanitize(html).trim()
    const matches = html.match(/<style default-inline-css>((.|\n)*)<\/style>/gi)
    if (matches)
      cleanHtml = matches[0] + cleanHtml

    return cleanHtml
  }

}