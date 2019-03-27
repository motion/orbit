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

export function fromEntries(iterable: any[]): { [key: string]: any } {
  return [...iterable].reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {})
}

export function selectDefined(...args: any[]) {
  for (const arg of args) {
    if (typeof arg !== 'undefined') {
      return arg
    }
  }
}

export function mergeDefined<A>(...args: A[]): A {
  const res = {}
  const keys = [...new Set([].concat(...args.map(a => Object.keys(a))))]
  for (const key of keys) {
    for (const obj of args) {
      if (typeof obj[key] !== 'undefined') {
        res[key] = obj[key]
      }
    }
  }
  return res as A
}

// splits an object into two based on the filterFn return value
// returns two-arity array of objects
export function partitionObject<A extends Object>(
  obj: A,
  filterFn: (key: string) => boolean,
): [Partial<A>, Partial<A>] {
  const a: Partial<A> = {}
  const b: Partial<A> = {}
  for (const key in obj) {
    if (filterFn(key)) {
      a[key] = obj[key]
    } else {
      b[key] = obj[key]
    }
  }
  return [a, b]
}
