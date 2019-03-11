import { loadMany } from '@o/bridge'
import { SearchQuery, SearchResultModel } from '@o/models'
import { flattenGroupedSearchResults } from './flattenGroupedSearchResults'

// TODO dup from @o/mediator
export type QueryOptions<ModelType> = {
  [P in keyof ModelType]?: ModelType[P] extends Array<infer U>
    ? QueryOptions<U>
    : ModelType[P] extends ReadonlyArray<infer U>
    ? QueryOptions<U>
    : ModelType[P] extends object
    ? QueryOptions<ModelType[P]>
    : boolean
}

export async function searchBits(args: SearchQuery) {
  const res = await loadMany(SearchResultModel, { args })
  return flattenGroupedSearchResults(res)
}
