import { resolveMany } from '@mcro/mediator'
import { SearchResultModel, SearchQuery } from '@mcro/models'
import { Cosal } from '@mcro/cosal'
import { getSearchQuery } from './getSearchQuery'
import { getRepository } from 'typeorm'
import { BitEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { uniqBy } from 'lodash'

const log = new Logger('search')

type SearchArgs = SearchQuery & {
  cosal: Cosal
}

const searchCache = doSearch => {
  // a simple way to cache the results based on `query`
  let currentSearch = { hash: '', allResults: null }
  let curId = 0

  return async args => {
    curId = Math.random()
    const id = curId
    const hash = JSON.stringify(args)
    if (hash === currentSearch.hash && currentSearch.allResults) {
      return currentSearch.allResults
    } else {
      const allResults = await doSearch(args)
      if (id === curId) {
        currentSearch = { hash, allResults }
        return allResults
      } else {
        return []
      }
    }
  }
}

// async function ftsSearch(args: SearchArgs) {
//   const all = await args.database.all(
//     'SELECT id FROM bit_entity JOIN search_index WHERE search_index MATCH ? ORDER BY rank LIMIT ?',
//     args.query,
//     200,
//   )
//   const ids = all.map(x => x.id)
//   return await getRepository(BitEntity).find({ id: { $in: ids } })
// }

async function searchCosalIds(args: SearchArgs, includeFilters = false): Promise<number[]> {
  const otherFilters = `${(args.peopleFilters || []).join(' ')} ${(args.locationFilters || []).join(
    ' ',
  )}`
  const query = `${args.query} ${includeFilters ? otherFilters : ''}`.trim()
  log.info(`Cosal search: ${query}`)
  if (!query) {
    return []
  }
  return (await args.cosal.search(query, 300)).map(x => x.id)
}

async function cosalSearch(args: SearchArgs, includeFilters = false): Promise<BitEntity[]> {
  const ids = await searchCosalIds(args, includeFilters)
  if (ids.length) {
    return await getRepository(BitEntity).find({ id: { $in: ids } })
  } else {
    return []
  }
}

async function likeSearch(args: SearchArgs): Promise<BitEntity[]> {
  if (args.sortBy === 'Topic') {
    return []
  }
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
  return await getRepository(BitEntity).find(searchQuery)
}

// we'll get a lot of cosal results
// and then do a search for the ids that match the filters
async function doTopicSearch(args: SearchArgs) {
  const bits = await cosalSearch(args)
  console.log('doTopic', args, bits)
  // simpler filter...
  return bits.filter(bit => {
    const ints = args.integrationFilters
    const locs = args.locationFilters
    if (ints && ints.some(x => bit.integration === x)) {
      return true
    }
    if (locs && locs.some(x => bit.location.name === x)) {
      return true
    }
    return false
  })
}

const doSearch = searchCache(async args => {
  if (args.sortBy == 'Topic') {
    return await doTopicSearch(args)
  }

  const [likeResults, cosalResults] = await Promise.all([likeSearch(args), cosalSearch(args)])
  console.log('likeResults', likeResults)
  console.log('cosalResults', cosalResults)

  let results = []
  let restResults = []

  // if we have match between BOTH thats good.. for a start
  for (const bit of likeResults) {
    if (cosalResults.findIndex(x => x.id === bit.id) > -1) {
      results.push(bit)
    } else {
      restResults.push(bit)
    }
  }
  // throw in the cosal results so we return them all
  restResults = [...restResults, ...cosalResults]

  return uniqBy([...results, ...restResults], 'id')
})

export const getSearchResolver = (cosal: Cosal) => {
  return resolveMany(SearchResultModel, async args => {
    const results = await doSearch({ ...args, cosal })
    log.verbose('sending search results...', results.length)
    return results.slice(args.skip, args.take + args.skip)
  })
}
