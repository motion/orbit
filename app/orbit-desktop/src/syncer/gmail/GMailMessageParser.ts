import { GmailBitDataParticipant } from '@mcro/models'
import { GmailMessage } from '@mcro/services'

const createDOMPurify = require('dompurify')
const JSDOM = require('jsdom').JSDOM
const addrs = require('email-addresses')
const window = (new JSDOM('')).window
const DOMPurify = createDOMPurify(window)

/**
 * Parses Gmail Message.
 */
export class GMailMessageParser {

  constructor(private message: GmailMessage) {
  }
  
  /**
   * Gets the date from the Gmail message.
   * Returns Date object if message contains a date, otherwise returns undefined
   */
  getDate(): number {
    const dateHeader = this.message.payload.headers.find(x => x.name === 'Date')
    if (dateHeader && dateHeader.value)
      return new Date(dateHeader.value).getTime()

    return parseInt(this.message.internalDate)
  }

  /**
   * Gets the title from the Gmail message.
   * Returns a string if message contains a title, otherwise returns undefined
   */
  getTitle(): string|undefined {
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
      .filter(header => header.name === 'From' || header.name === 'To'  || header.name === 'Cc')
      .forEach(header => {
        const type: 'from'|'to' = header.name === 'From' ? 'from' : 'to'
        const emails = addrs.parseAddressList(header.value)
        emails.forEach(email => {
          participants.push({ name: email.name, email: email.address, type })
        })
      })

    return participants
  }

  /**
   * Gets message text body.
   */
  getTextBody() {
    const parts = [
      ...(this.message.payload.parts || []),
      this.message.payload,
    ]

    let textBody = ''
    const textPart = parts.find(part => {
      return part.mimeType === 'text/plain' && !!part.body && !!part.body.data
    })
    if (textPart) {
      textBody = Buffer.from(textPart.body.data, 'base64').toString('utf8')
    }

    let htmlBody = ''
    const htmlPart = parts.find(part => {
      return part.mimeType === 'text/html' && !!part.body && !!part.body.data
    })
    if (htmlPart) {
      htmlBody = Buffer.from(htmlPart.body.data, 'base64').toString('utf8')
    }

    if (textBody) {
      return textBody

    } else if (htmlBody) {
      return DOMPurify
        .sanitize(htmlBody, { ALLOWED_TAGS: [] })
        .replace(/&nbsp;/gi, ' ')
        .replace(/•/gi, '')
        .trim()

    } else {
      return this.message.snippet
    }
  }

  /**
   * Gets message html body.
   */
  getHtmlBody() {
    const parts = [
      ...(this.message.payload.parts || []),
      this.message.payload,
    ]

    let textBody = ''
    const textPart = parts.find(part => {
      return part.mimeType === 'text/plain' && !!part.body && !!part.body.data
    })
    if (textPart) {
      textBody = Buffer.from(textPart.body.data, 'base64').toString('utf8')
    }

    let htmlBody = ''
    const htmlPart = parts.find(part => {
      return part.mimeType === 'text/html' && !!part.body && !!part.body.data
    })
    if (htmlPart) {
      htmlBody = Buffer.from(htmlPart.body.data, 'base64').toString('utf8')
    }

    if (htmlBody) {
      return DOMPurify
        .sanitize(htmlBody)
        .replace(/<div class="gmail_quote">((.|\n)*)<\/div>/, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/•/gi, '')
        .trim()

    } else if (textBody) {
        return textBody

    } else {
      return this.message.snippet
    }
  }
  
}
