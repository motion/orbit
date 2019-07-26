import AwaitLock from 'await-lock'

export * from './highlightText'
export * from './on'
export * from './randomWords'

export const Lock = AwaitLock

/**
 * Remove last X items from array (without mutating).
 */
export function removeLast(arr: any[], num = 1) {
  let x = [...arr]
  x.splice(-num, num)
  return x
}

/**
 * Returns what its given.
 */
export function idFn<A>(a?: A) {
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
export async function orTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  let tm: any
  let didReject = false
  let waitForTimeout = new Promise<any>((_, reject) => {
    tm = setTimeout(() => {
      didReject = true
      reject(OR_TIMED_OUT)
    }, timeout)
  })
  const res = await Promise.race([promise, waitForTimeout])
  // prevent lots of unecessary pauses when using Pause on Exceptions
  if (!didReject) {
    clearTimeout(tm)
  }
  return await res
}

/**
 * Creates a promise that resolves in a given number of milliseconds.
 */
export function sleep(ms: number) {
  if (!ms) return Promise.resolve()
  return new Promise(res => setTimeout(res, ms))
}

/**
 * Just hash a string (thx darksky: https://git.io/v9kWO)
 */
export function stringHash(str: string): number {
  let res = 5381
  let i = 0
  let len = str.length
  while (i < len) {
    res = (res * 33) ^ str.charCodeAt(i++)
  }
  return res >>> 0
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

/**
 * Simple opposite of Object.toEntries() can be removed once chrome has it
 */
export function fromEntries(iterable: any[]): { [key: string]: any } {
  return [...iterable].reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {})
}

/**
 * Return the first arg that is not undefined
 */
export function selectDefined(...args: any[]) {
  for (const arg of args) {
    if (arg !== undefined) {
      return arg
    }
  }
}

/**
 * Return an object that consists of all defined properties
 *   TODO make this use a weakmap likely
 */
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

/**
 * splits an object into two based on the filterFn return value.
 * returns two-arity array of objects
 */
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

/**
 * A typed partition function for lists
 */
export function partition<T, U extends T>(
  list: T[],
  predicate: (v: T) => v is U,
): [U[], Exclude<T, U>[]]
export function partition<T>(list: T[], predicate: (x: T) => boolean): [T[], T[]]
export function partition<T, U extends T>(
  list: T[],
  predicate: (v: T) => boolean,
): [U[], Exclude<T, U>[]] {
  let a: any[] = []
  let b: any[] = []
  for (const x of list) {
    if (predicate(x)) {
      a.push(x)
    } else {
      b.push(x)
    }
  }
  return [a, b]
}

/**
 * Scale a number thats within prev range to new range
 */
export const numberScaler = (prevMin: number, prevMax: number, newMin: number, newMax: number) => (
  x: number,
) => ((newMax - newMin) * (x - prevMin)) / (prevMax - prevMin) + newMin

/**
 * Bound a number between a min and max
 */
export const numberBounder = (min: number, max: number) => (val: number) =>
  val < min ? min : val > max ? max : val

/**
 * Integrate into orbits global debug logging
 */
export const shouldDebug = (level: number = 1) => {
  return typeof window !== 'undefined' && window['enableLog'] >= level
}
