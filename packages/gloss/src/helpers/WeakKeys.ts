const WeakKeys = new WeakMap<any, string>()

export const weakKey = (x: any) => {
  if (!WeakKeys.has(x)) {
    WeakKeys.set(x, `${Math.round(Math.random() * 1000000000)}`)
  }
  return WeakKeys.get(x)!
}
