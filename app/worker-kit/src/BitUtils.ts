const createDOMPurify = require('dompurify')
const JSDOM = require('jsdom').JSDOM

/**
 * Strips HTML from the given HTML text content.
 */
export function stripHtml(value: string) {
  if (!value) return ''

  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window)
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] })
    .replace(/&nbsp;/gi, ' ')
    .replace(/•/gi, '')
    .trim()
}

/**
 * Sanitizes given HTML text content.
 */
export function sanitizeHtml(value: string) {
  if (!value) return ''

  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window)
  return DOMPurify.sanitize(value).trim()
}
