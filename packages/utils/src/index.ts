import stringHash from 'string-hash'

/**
 * Runs given callback that returns promise for each item in the given collection in order.
 * Operations executed after each other, right after previous promise being resolved.
 */
export function sequence<T, U>(collection: T[], callback: (item: T) => Promise<U>): Promise<U[]> {
  const results: U[] = []
  return collection
    .reduce((promise, item) => {
      return promise
        .then(() => {
          return callback(item)
        })
        .then(result => {
          results.push(result)
        })
    }, Promise.resolve())
    .then(() => {
      return results
    })
}

/**
 * Type-safe version of Object.assign.
 */
export function assign<T>(obj: T, properties: Partial<T>) {
  return Object.assign(obj, properties)
}

/**
 * Creates a timeout and returns a Promise for it.
 */
export function timeout<T>(ms: number, callback: () => T | Promise<T>): Promise<T> {
  return new Promise((ok, fail) => {
    setTimeout(() => {
      try {
        const result = callback()
        if (result instanceof Promise) {
          result.then(res => ok(res)).catch(err => fail(err))
        } else {
          ok(result)
        }
      } catch (err) {
        fail(err)
      }
    }, ms)
  })
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
