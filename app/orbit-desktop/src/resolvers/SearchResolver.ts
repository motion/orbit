import { resolveMany } from '@mcro/mediator'
import { SearchResultModel } from '@mcro/models'
import { Cosal } from '@mcro/cosal'
import { getSearchQuery } from './getSearchQuery'
import { getRepository } from 'typeorm'
import { BitEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'

const log = new Logger('search')

// a simple way to cache the results based on `query`
let currentSearch = { hash: '', allResults: null }
let curId = 0

const getBasicSearch = async args => {
  curId = Math.random()
  const id = curId
  const hash = JSON.stringify(args)
  if (hash === currentSearch.hash) {
    return currentSearch.allResults
  } else {
    const searchQuery = getSearchQuery({
      query: args.query,
      sortBy: args.sortBy,
      // just get a lot of results for now and we slice them on sending back to UI
      // we'll need to implement some logic here later to grab more if the args.take > 100
      take: 100,
      skip: 0,
      startDate: args.startDate,
      endDate: args.endDate,
      integrationFilters: args.integrationFilters,
      peopleFilters: args.peopleFilters,
      locationFilters: args.locationFilters,
    })
    console.log('searchQuery', searchQuery)
    const allResults = await getRepository(BitEntity).find(searchQuery)
    if (id === curId) {
      currentSearch = { hash, allResults }
      return allResults
    } else {
      return false
    }
  }
}

export const getSearchResolver = (cosal: Cosal) => {
  return resolveMany(SearchResultModel, async args => {
    console.time('basicSearch')
    const results = await getBasicSearch(args)
    console.timeEnd('basicSearch')
    if (!results) {
      console.log('expired query')
      return []
    }
    log.verbose('sending search results...', results.length)
    return results.slice(args.skip, args.take + args.skip)
  })
}
