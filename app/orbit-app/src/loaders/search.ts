import { SearchQuery, SearchResultModel, SearchTopicsModel } from '@mcro/models'
import { loadMany } from '@mcro/model-bridge'

export async function getSearchResults(args: SearchQuery) {
  return await loadMany(SearchResultModel, {
    args,
  })
}

export async function getSearchResultsByTopic(args: SearchQuery) {
  return await loadMany(SearchResultModel, {
    args: {
      ...args,
      sortBy: 'Topic',
    },
  })
}

export async function getTopics({ query, count }: { query: SearchQuery; count: number }) {
  return await loadMany(SearchTopicsModel, {
    args: { query, count },
  })
}
