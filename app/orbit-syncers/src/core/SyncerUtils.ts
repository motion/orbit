const createDOMPurify = require('dompurify')
const JSDOM = require('jsdom').JSDOM

/**
 * Common utils for syncers.
 */
export class SyncerUtils {

  /**
   * Strips HTML from the given HTML text content.
   */
  static stripHtml(value: string) {
    if (!value) return ''

    const window = (new JSDOM('')).window
    const DOMPurify = createDOMPurify(window)
    return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] })
      .replace(/&nbsp;/gi, ' ')
      .replace(/•/gi, '')
      .trim()
  }

  /**
   * Sanitizes given HTML text content.
   */
  static sanitizeHtml(value: string) {
    if (!value) return ''

    const window = (new JSDOM('')).window
    const DOMPurify = createDOMPurify(window)
    return DOMPurify.sanitize(value).trim()
  }

}
