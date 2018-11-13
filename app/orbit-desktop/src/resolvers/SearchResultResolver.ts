import { Cosal } from '@mcro/cosal'
import { BitEntity, SourceEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { resolveMany } from '@mcro/mediator'
import { Bit, SearchQuery, SearchResult, SearchResultModel } from '@mcro/models'
import { BitContentTypes } from '@mcro/models'
import * as _ from 'lodash'
import { uniqBy } from 'lodash'
import { getRepository } from 'typeorm'
import { getSearchQuery } from './getSearchQuery'
import { highlightText } from '@mcro/helpers'

const log = new Logger('search')

type SearchArgs = SearchQuery & {
  cosal: Cosal
}

const searchCache = doSearch => {
  // a simple way to cache the results based on `query`
  let currentSearch = { hash: '', allResults: null }
  let curId = 0

  return async (log, args) => {
    curId = Math.random()
    const id = curId
    const hash = JSON.stringify(args)
    if (hash === currentSearch.hash && currentSearch.allResults) {
      return currentSearch.allResults
    } else {
      const allResults = await doSearch(log, args)
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
  return (await args.cosal.search(query, Math.max(300, args.take))).map(x => x.id)
}

async function cosalSearch(
  args: SearchArgs,
  includeFilters = false,
): Promise<[BitEntity[], number]> {
  if (!args.cosal) return [[], 0]

  const ids = await searchCosalIds(args, includeFilters)
  if (ids.length) {
    const searchQuery = getSearchQuery({
      // TODO: umed added these to fix type errors...
      take: 10,
      query: args.query,
      sortBy: args.sortBy,
      startDate: args.startDate,
      endDate: args.endDate,
      integrationFilters: args.integrationFilters,
      peopleFilters: args.peopleFilters,
      locationFilters: args.locationFilters,
      sourceId: args.sourceId,
      spaceId: args.spaceId,
      contentType: args.contentType,
      ids,
    })
    // console.log('searchQuery (cosal)', searchQuery)
    return await getRepository(BitEntity).findAndCount(searchQuery)
  } else {
    return [[], 0]
  }
}

async function likeSearch(args: SearchArgs): Promise<[BitEntity[], number]> {
  if (args.searchBy === 'Topic') {
    return [[], 0]
  }

  const searchQuery = getSearchQuery({
    query: args.query,
    sortBy: args.sortBy,
    // just get a lot of results for now and we slice them on sending back to UI
    // we'll need to implement some logic here later to grab more if the args.take > 100
    take: 10,
    skip: 0,
    startDate: args.startDate,
    endDate: args.endDate,
    integrationFilters: args.integrationFilters,
    peopleFilters: args.peopleFilters,
    locationFilters: args.locationFilters,
    sourceId: args.sourceId,
    spaceId: args.spaceId,
    contentType: args.contentType,
  })
  // console.log('searchQuery', searchQuery)
  return await getRepository(BitEntity).findAndCount(searchQuery)
}

// we'll get a lot of cosal results
// and then do a search for the ids that match the filters
async function doTopicSearch(args: SearchArgs): Promise<[Bit[], number]> {
  const [bits, count] = await cosalSearch(args)
  // console.log('doTopic', args, bits)
  // simpler filter...
  const filtered = bits.filter(bit => {
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
  return [filtered, count]
}

const doSearch = searchCache(async (log: Logger, args: SearchArgs) => {
  if (args.searchBy == 'Topic') {
    return await doTopicSearch(args)
  }

  log.timer(`like results`)
  const [likeResults, likeResultsCount] = await likeSearch(args)
  log.timer(`like results`, { likeResults, likeResultsCount })

  log.timer(`cosal results`)
  const [cosalResults, cosalResultsCount] = await cosalSearch(args)
  log.timer(`cosal results`, { cosalResults, cosalResultsCount })

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

  return [uniqBy([...results, ...restResults], 'id'), likeResultsCount + cosalResultsCount]
})

const buildSearchResultTitle = (titles: string[]) => {
  titles = titles.map(title => title.replace(/\n/g, ' ').trim())
  let title = _.uniq(titles).join(', ')
  if (title.length > 20) {
    title = title.substr(0, 17) + '...'
  }
  return title
}

const buildSearchResultText = (keyword: string, texts: string[]) => {
  return _.uniq(
    texts.map(text => {
      text = text.replace(/\n/g, ' ').trim()
      return highlightText({
        text,
        words: [keyword],
        trimWhitespace: true,
        noSpans: true,
        maxChars: 20,
        maxSurroundChars: 10,
      })
    }),
  ).join(', ')
}

export const getSearchResolver = (cosal: Cosal) => {
  return resolveMany(SearchResultModel, async args => {
    const log = new Logger('search (' + args.query + ', ' + args.group +')') // we need a separate logger because requests can be parallel and timer won't work correctly
    const sources = await getRepository(SourceEntity).find({ spaceId: args.spaceId }) // todo: we probably need to get in count space id
    let searchResults: SearchResult[] = []

    const dayAgo = new Date()
    dayAgo.setDate(dayAgo.getDate() - 1)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    const monthAndDayAgo = new Date()
    monthAndDayAgo.setDate(monthAndDayAgo.getDate() - 31)
    // const weekAndDayAgo = new Date()
    // weekAndDayAgo.setDate(weekAndDayAgo.getDate() - 8)

    let startDate, endDate

    log.timer('search', args.query, args)
    if (args.group === 'last-day') {
      startDate = dayAgo
    } else if (args.group === 'last-week') {
      startDate = weekAgo
      endDate = dayAgo
    } else if (args.group === 'last-month') {
      startDate = monthAgo
      endDate = weekAgo
    } else if (args.group === 'overall') {
      endDate = monthAndDayAgo
    }

    for (let contentType of BitContentTypes) {
      const [bits, bitsTotalCount] = await doSearch(log, {
        ...args,
        cosal,
        startDate,
        endDate,
        contentType,
      })
      if (!bits.length) continue

      const bitSourceIds = _.uniq(bits.map(bit => bit.sourceId))
      const bitSources = sources.filter(source => bitSourceIds.indexOf(source.id) !== -1)
      const bitSourceNames = bitSources.map(source => source.name).join(', ')
      const bitLocationNames = bits.filter(bit => !!bit.location.name).map(bit => bit.location.name)
      const bitSourceTypeNames = bitSources.map(source => source.type) // todo: beatify type name
      const text = buildSearchResultText(args.query, bits.map(bit => bit.body))
      const firstBits = args.maxBitsCount ? bits.slice(0, args.maxBitsCount) : bits

      if (contentType === 'conversation') {
        const title = buildSearchResultTitle(bitLocationNames.map(name => '#' + name))
        searchResults.push({
          id: Math.random(),
          group: args.group,
          title: 'Conversation in ' + title,
          contentType,
          text,
          bitsTotalCount,
          bits: firstBits,
        })
      } else if (contentType === 'mail') {
        searchResults.push({
          id: Math.random(),
          group: args.group,
          title: 'Emails in ' + bitSourceNames,
          contentType,
          text,
          bitsTotalCount,
          bits: firstBits,
        })
      } else if (contentType === 'document') {
        const title = buildSearchResultTitle(bitLocationNames)
        searchResults.push({
          id: Math.random(),
          group: args.group,
          title: 'Files in ' + title ? title : bitSourceNames,
          contentType,
          text,
          bitsTotalCount,
          bits: firstBits,
        })
      } else if (contentType === 'task') {
        searchResults.push({
          id: Math.random(),
          group: args.group,
          title: 'Tasks from ' + bitSourceTypeNames,
          contentType,
          text,
          bitsTotalCount,
          bits: firstBits,
        })
      } else if (contentType === 'website') {
        searchResults.push({
          id: Math.random(),
          group: args.group,
          title: 'Pages from ' + bitSourceNames,
          contentType,
          text,
          bitsTotalCount,
          bits: firstBits,
        })
      }
    }

    log.timer('search', searchResults)
    return searchResults
  })
}
