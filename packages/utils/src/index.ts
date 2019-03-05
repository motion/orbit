import stringHash from 'string-hash'

export * from './highlightText'
export * from './on'

/**
 * Creates a promise that resolves in a given number of milliseconds.
 */
export function sleep(ms: number) {
  if (!ms) return Promise.resolve()
  return new Promise(res => setTimeout(res, ms))
}

/**
 * Generates a hash number for a given object.
 * Make sure given object does not have circular structure.
 *
 * @see https://github.com/darkskyapp/string-hash
 */
export function hash(value: any): number {
  return stringHash(JSON.stringify(value))
}

/**
 * Generates a random string.
 */
export function randomString(length: number) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}
