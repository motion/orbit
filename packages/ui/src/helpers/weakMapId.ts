const cache = new WeakMap<any, number>()

export function weakMapId(item: any): number {
  if (!item || typeof item !== 'object') {
    throw new Error(`Invalid object for weakmap`)
  }
  let id = cache.get(item)
  if (id) return id
  id = Math.random()
  cache.set(item, id)
  return id
}
