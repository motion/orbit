export function memoizeOne<Result>(cb: Function): (a: any) => Result {
  const Cache = new WeakMap()
  return (key: any) => {
    // use first argument as key
    const mappable = key && typeof key === 'object'
    if (mappable) {
      const res = Cache.get(key)
      if (res) {
        return res
      }
    }
    const newVal: Result = cb(key)
    if (mappable) {
      Cache.set(key, newVal)
    }
    return newVal
  }
}
