import { GmailMessage } from './GMailTypes'

/**
 * Gets the date from the Gmail message.
 * Returns Date object if message contains a date, otherwise returns undefined
 */
export function parseMailDate(message: GmailMessage): number|undefined {
  const dateHeader = message.payload.headers.find(x => x.name === 'Date')
  return dateHeader && dateHeader.value ? new Date(dateHeader.value).getTime() : undefined
}

/**
 * Gets the title from the Gmail message.
 * Returns a string if message contains a title, otherwise returns undefined
 */
export function parseMailTitle(message: GmailMessage): string|undefined {
  const dateHeader = message.payload.headers.find(x => x.name === 'Subject')
  return dateHeader && dateHeader.value ? dateHeader.value : undefined
}

/**
 * Gets the sender details from a Gmail message.
 * Returns a string name and email.
 */
export function parseSender(message: GmailMessage): [string|undefined, string|undefined] {
  const from = message.payload.headers.find(x => x.name === 'From')
  if (from && from.value) {
    const match = /(.*?) <(.*?)>/g.exec(from.value);
    if (match[1] && match[2])
      return [match[1], match[2]]
  }
  return [undefined, undefined];
}
