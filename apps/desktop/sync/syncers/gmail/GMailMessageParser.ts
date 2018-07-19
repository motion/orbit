import { GmailMessage } from '~/sync/syncers/gmail/GMailTypes'

/**
 * Gets the date from the Gmail message.
 * Returns Date object if message contains a date, otherwise returns undefined
 */
export function parseMailDate(message: GmailMessage): Date|undefined {
  const dateHeader = message.payload.headers.find(x => x.name === 'Date')
  const date = dateHeader && dateHeader.value
  return date ? new Date(date) : undefined
}

/**
 * Gets the title from the Gmail message.
 * Returns a string if message contains a title, otherwise returns undefined
 */
export function parseMailTitle(message: GmailMessage): string|undefined {
  const dateHeader = message.payload.headers.find(x => x.name === 'Subject')
  return dateHeader && dateHeader.value ? dateHeader.value : undefined
}
