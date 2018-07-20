import { GmailMessage } from './GMailTypes'

/**
 * Gets the date from the Gmail message.
 * Returns Date object if message contains a date, otherwise returns undefined
 */
export function parseMailDate(message: GmailMessage): Date|undefined {
  const dateHeader = message.payload.headers.find(x => x.name === 'Date')
  return dateHeader && dateHeader.value ? new Date(dateHeader.value) : undefined
}

/**
 * Gets the title from the Gmail message.
 * Returns a string if message contains a title, otherwise returns undefined
 */
export function parseMailTitle(message: GmailMessage): string|undefined {
  const dateHeader = message.payload.headers.find(x => x.name === 'Subject')
  return dateHeader && dateHeader.value ? dateHeader.value : undefined
}
