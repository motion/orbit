export function groupByFirstLetter<A extends any>(items: A[]): ({ item: A; group?: string })[] {
  return items.map(item => {
    let letter
    if (!item.name) {
      letter = '0-9'
    } else {
      letter = item.name[0].toLowerCase()
      if (+item.name[0] === +item.name[0]) {
        letter = '0-9'
      }
    }
    return { item, group: letter.toUpperCase() }
  })
}
