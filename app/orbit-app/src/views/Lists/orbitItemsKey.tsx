import sum from 'hash-sum'

export function orbitItemsKey(items: any[]) {
  return sum(
    items.map((x, index) => {
      const item = x.item || x
      return `${item.id || item.email || item.key || index}`
    }),
  )
}
