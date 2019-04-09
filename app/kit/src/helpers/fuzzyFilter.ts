import fuzzySort from 'fuzzysort'

export const fuzzyFilter = <A extends Object[]>(query: string, results: A, extraOpts?): A => {
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
