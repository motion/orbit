import { loadMany } from '@o/bridge'
import { SearchQuery, SearchResultModel } from '@o/models'
import { flattenGroupedSearchResults } from './flattenGroupedSearchResults'

export async function searchBits(args: SearchQuery) {
  const res = await loadMany(SearchResultModel, { args })
  return flattenGroupedSearchResults(res)
}
