import { loadMany } from '@o/bridge'
import { SearchQuery, SearchResultModel } from '@o/models'

export async function searchBits(args: SearchQuery) {
  return await loadMany(SearchResultModel, { args })
}
