import { FuzzySearch } from '@o/fuzzy-search'

export const fuzzyFilter = <A = any>(
  query: string,
  results: A[],
  extraOpts?: {
    keys: string[]
  },
): A[] => {
  if (!query) {
    return results
  }
  const searcher = new FuzzySearch(results, extraOpts ? extraOpts.keys : ['title', 'name'], {
    caseSensitive: false,
  })
  return searcher.search(query)
}
