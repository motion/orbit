import * as Helpers from '../../helpers'

export const uniq = arr => {
  const added = {}
  const final = []
  for (const item of arr) {
    if (!added[item.id]) {
      final.push(item)
      added[item.id] = true
    }
  }
  return final
}

export const matchSort = (query, results) => {
  if (!results.length) {
    return results
  }
  const strongTitleMatches = Helpers.fuzzyQueryFilter(query, results, {
    threshold: -40,
  })
  return uniq([...strongTitleMatches, ...results])
}
