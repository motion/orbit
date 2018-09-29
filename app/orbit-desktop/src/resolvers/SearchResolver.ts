import { resolveMany } from '@mcro/mediator'
import { SearchResultModel } from '@mcro/models'
import { Cosal } from '@mcro/cosal'
import { getSearchQuery } from './getSearchQuery'
import { getRepository } from 'typeorm'
import { BitEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { uniqBy } from 'lodash'

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

async function cosalSearch(cosal: Cosal, query: string) {
  console.time('cosalSearch')
  const res = await cosal.search(query, 20)
  console.timeEnd('cosalSearch')
  const ids = res.map(x => x.id)
  const cosalBits = await getRepository(BitEntity).find({ id: { $in: ids } })
  return cosalBits
}

export const getSearchResolver = (cosal: Cosal) => {
  return resolveMany(SearchResultModel, async args => {
    const [sqlResults, cosalResults] = await Promise.all([
      getBasicSearch(args),
      cosalSearch(cosal, args.query),
    ])
    if (sqlResults === false) {
      console.log('expired query', args.query)
      return []
    }
    const results = uniqBy([...cosalResults, ...sqlResults], 'id')
    log.verbose('sending search results...', results.length)
    return results.slice(args.skip, args.take + args.skip)
  })
}
