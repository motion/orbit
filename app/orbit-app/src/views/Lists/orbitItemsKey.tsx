export function orbitItemsKey(items: any[]) {
  return items
    .map((x, index) => {
      const item = x.item || x
      return `${item.id || item.email || item.key || index}`
    })
    .join(' ')
}
