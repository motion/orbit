import { GmailBitDataParticipant, GMailMessage } from './GMailModels'

const createDOMPurify = require('dompurify')
const JSDOM = require('jsdom').JSDOM
const addrs = require('email-addresses')

/**
 * Parses GMail Message.
 */
export class GMailMessageParser {
  /**
   * Message's cached text body (used for performance optimization).
   */
  private textBody: string

  /**
   * Message's cached html body (used for performance optimization).
   */
  private htmlBody: string

  constructor(private message: GMailMessage) {}

  /**
   * Gets the date from the Gmail message.
   * Returns Date object if message contains a date, otherwise returns undefined
   */
  getDate(): number {
    const dateHeader = this.message.payload.headers.find(x => x.name === 'Date')
    if (dateHeader && dateHeader.value) {
      const date = new Date(dateHeader.value).getTime()
      if (!isNaN(date)) // for some reason some dates have different format
        return date
    }

    return parseInt(this.message.internalDate)
  }

  /**
   * Gets the title from the Gmail message.
   * Returns a string if message contains a title, otherwise returns undefined
   */
  getTitle(): string | undefined {
    const dateHeader = this.message.payload.headers.find(x => x.name === 'Subject')
    return dateHeader && dateHeader.value ? dateHeader.value : undefined
  }

  /**
   * Gets all participants in a Gmail message.
   * Returns a string name and email.
   */
  getParticipants(): GmailBitDataParticipant[] {
    const participants: GmailBitDataParticipant[] = []
    this.message.payload.headers
      .filter(header => header.name === 'From' || header.name === 'To' || header.name === 'Cc')
      .forEach(header => {
        const type: 'from' | 'to' = header.name === 'From' ? 'from' : 'to'
        const emails = addrs.parseAddressList(header.value)
        if (emails) {
          emails.forEach(email => {
            participants.push({ name: email.name, email: email.address, type })
          })
        }
      })

    return participants
  }

  /**
   * Gets message text body.
   */
  getTextBody() {
    this.buildTextBody()
    this.buildHtmlBody()

    if (this.textBody) {
      return this.removeAnnoyingCharacters(this.textBody)
    } else if (this.htmlBody) {
      const window = new JSDOM('').window
      const DOMPurify = createDOMPurify(window)
      return this.removeAnnoyingCharacters(DOMPurify.sanitize(this.htmlBody, { ALLOWED_TAGS: [] }))
    } else {
      return this.removeAnnoyingCharacters(this.message.snippet)
    }
  }

  /**
   * Gets message html body.
   */
  getHtmlBody() {
    this.buildTextBody()
    this.buildHtmlBody()

    if (this.htmlBody) {
      const window = new JSDOM('').window
      const DOMPurify = createDOMPurify(window)
      return DOMPurify.sanitize(this.htmlBody)
        .replace(/<div class="gmail_quote">((.|\n)*)<\/div>/, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/•/gi, '')
        .trim()
    } else if (this.textBody) {
      return this.textBody
    } else {
      return this.message.snippet
    }
  }

  /**
   * Removes some annoying characters that we don't wanna see in the body.
   */
  private removeAnnoyingCharacters(str: string) {
    return (
      str
        // gmail formats plain text links as <http://google.com>
        // turn <http://google.com> => http://google.com
        .replace(/<([^>]+)>/g, '$1')
        .replace(/&nbsp;/gi, ' ')
        .replace(/•/gi, '')
        .replace(/\s/g, ' ')
        .trim()
    )
  }

  /**
   * Builds message's text body.
   */
  private buildTextBody() {
    if (this.textBody) return

    const parts = [...(this.message.payload.parts || []), this.message.payload]

    const textPart = parts.find(part => {
      return part.mimeType === 'text/plain' && !!part.body && !!part.body.data
    })
    if (textPart) {
      this.textBody = Buffer.from(textPart.body.data, 'base64').toString('utf8')
    }
  }

  /**
   * Builds message's html body.
   */
  private buildHtmlBody() {
    if (this.htmlBody) return

    const parts = [...(this.message.payload.parts || []), this.message.payload]

    const htmlPart = parts.find(part => {
      return part.mimeType === 'text/html' && !!part.body && !!part.body.data
    })
    if (htmlPart) {
      this.htmlBody = Buffer.from(htmlPart.body.data, 'base64').toString('utf8')
    }
  }
}
