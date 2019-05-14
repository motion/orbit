import stringHash from 'string-hash'

export * from './highlightText'
export * from './on'

/**
 * Simply returns what its given.
 */
export function idFn<A>(a: A) {
  return a
}

/**
 * Boolean if anything is defined
 */
export function isDefined(...args: any) {
  for (const arg of args) {
    if (typeof arg !== 'undefined') {
      return true
    }
  }
  return false
}

/**
 * Simple way to do something async, or timeout.
 */
export const OR_TIMED_OUT = Symbol('OR_TIMED_OUT')

export function orTimeout<T>(promise: Promise<T>, timeout): Promise<T> {
  let waitForTimeout = new Promise<any>((_, reject) => {
    setTimeout(() => reject(OR_TIMED_OUT), timeout)
  })
  return Promise.race([promise, waitForTimeout])
}

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
    if (arg !== undefined) {
      return arg
    }
  }
}

export function mergeDefined<A extends Object>(...args: A[]): A {
  const res = {}
  const keysSets = args.map(a => Object.keys(a))
  const keysFlat = [].concat(...(keysSets as any))
  const keys = [...new Set(keysFlat)]
  for (const key of keys) {
    for (const obj of args) {
      if (typeof key === 'string') {
        if (typeof obj[key] !== 'undefined') {
          res[key] = obj[key]
        }
      }
    }
  }
  return res as A
}

// only return if object
export const selectObject = (x: any) => {
  if (!x || typeof x !== 'object' || Array.isArray(x)) {
    return null
  }
  return x
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
