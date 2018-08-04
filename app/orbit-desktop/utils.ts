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