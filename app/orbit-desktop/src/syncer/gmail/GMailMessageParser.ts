import { GailBitDataParticipant } from '@mcro/models'
import { GmailMessage } from './GMailTypes'
const createDOMPurify = require('dompurify')
const JSDOM = require('jsdom').JSDOM

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
  getParticipants(): GailBitDataParticipant[] {
    return this.message.payload.headers
      .filter(header => header.name === 'From' || header.name === 'From')
      .map(header => {
        const type: "from"|"to" = header.name === 'From' ? "from" : "to"
        const match = /(.*?) <(.*?)>/g.exec(header.value);
        if (!match)
          return { email: header.value, type }

        return { name: match[1], email: match[2], type };
      })
  }

  /**
   * Gets message text body.
   */
  getTextBody() {
    const data = this.message.payload.parts[0].body.data
    return Buffer.from(data, 'base64').toString('utf8')
  }

  /**
   * Gets message html body.
   */
  getHtmlBody() {
    const data = this.message.payload.parts[1].body.data
    const html = Buffer.from(data, 'base64').toString('utf8')
    const window = (new JSDOM('')).window
    const DOMPurify = createDOMPurify(window)
    return DOMPurify.sanitize(html).replace(/<div class="gmail_quote">((.|\n)*)<\/div>/, '').trim()
  }
  
}
