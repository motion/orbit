import { resolveMany } from '@mcro/mediator'
import sqlite from 'sqlite'
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

async function cosalSearch(args: SearchArgs) {
  console.time('cosalSearch')
  const res = await args.cosal.search(args.query, 200)
  console.timeEnd('cosalSearch')
  const ids = res.map(x => x.id)
  return await getRepository(BitEntity).find({ id: { $in: ids } })
}

async function likeSearch(args: SearchArgs) {
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

const doSearch = searchCache(async args => {
  const [likeResults, cosalResults] = await Promise.all([
    likeSearch(args),
    cosalSearch(args),
    // ftsSearch(args),
  ])
  console.log('likeResults', likeResults)
  console.log('cosalResults', cosalResults)
  // console.log('ftsResults', ftsResults)
  // TODO algorithm for merging the three...

  let results = []
  let restResults = []

  const preferTopics = args.sortBy === 'Topic'

  // only use cosal for the topic based
  if (preferTopics) {
    for (const bit of cosalResults) {
      if (likeResults.findIndex(x => x.id === bit.id) > -1) {
        results.push(bit)
      } else {
        restResults.push(bit)
      }
    }
    // throw in the like results so we return them all
    restResults = [...restResults, ...likeResults]
  } else {
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
  }

  return uniqBy([...results, ...restResults], 'id')
})

export const getSearchResolver = (cosal: Cosal) => {
  return resolveMany(SearchResultModel, async args => {
    const results = await doSearch({ ...args, cosal })
    log.verbose('sending search results...', results.length)
    return results.slice(args.skip, args.take + args.skip)
  })
}
