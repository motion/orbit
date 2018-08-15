/**
 * Runs given callback that returns promise for each item in the given collection in order.
 * Operations executed after each other, right after previous promise being resolved.
 */
export function sequence<T, U>(collection: T[], callback: (item: T) => Promise<U>): Promise<U[]> {
  const results: U[] = [];
  return collection.reduce((promise, item) => {
    return promise.then(() => {
      return callback(item);
    }).then(result => {
      results.push(result);
    });
  }, Promise.resolve()).then(() => {
    return results;
  });
}

/**
 * Converts simple query object to a URL query string.
 * For example { a: "hello", b: "world" } getting converting into ?a=hello&b=world.
 * Skips undefined properties.
 */
export function queryObjectToQueryString(query: { [key: string]: any }|undefined): string {
  if (!query || !Object.keys(query).length)
    return "";

  return "?" + Object.keys(query)
    .filter(key => query[key] !== undefined)
    .map(key => `${key}=${query[key]}`)
    .join("&");
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
export function timeout<T>(ms: number, callback: () => T|Promise<T>): Promise<T> {
  return new Promise((ok, fail) => {
    setTimeout(() => {
      try {
        const result = callback()
        if (result instanceof Promise) {
          result
            .then(res => ok(res))
            .catch(err => fail(err))
        } else {
          ok(result)
        }
      } catch (err) {
        fail(err)
      }
    }, ms)
  })
}