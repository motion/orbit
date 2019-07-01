import fuzzySort from 'fuzzysort'

export const fuzzyFilter = <A extends { [key: string]: any }[]>(
  query: string,
  results: A,
  extraOpts?,
): A => {
  if (!query) {
    return results
  }
  const res = fuzzySort
    .go(query, results, {
      keys: ['title', 'name'],
      // threshold: -25,
      limit: 8,
      ...extraOpts,
    })
    .map(x => x.obj) as A
  return res
}
