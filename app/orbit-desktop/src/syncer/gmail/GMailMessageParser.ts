import { GmailBitDataParticipant } from '@mcro/models'
import { GmailMessage } from './GMailTypes'
const createDOMPurify = require('dompurify')
const JSDOM = require('jsdom').JSDOM
const addrs = require("email-addresses")

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
        const type: "from"|"to" = header.name === 'From' ? "from" : "to"
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
