import { Cosal } from '@o/cosal'
import { Logger } from '@o/logger'
import {
  AppEntity,
  Bit,
  BitContentType,
  BitContentTypes,
  SearchQuery,
  SearchResult,
} from '@o/models'
import { uniq, uniqBy } from 'lodash'
import { getRepository } from 'typeorm'
import { SearchQueryExecutor } from '../search/SearchQueryExecutor'
import { SearchResultUtils } from '../search/SearchResultUtils'

/**
 * Resolves search requests.
 */
export class SearchResultResolver {
  private log: Logger
  private cosal: Cosal
  private args: SearchQuery
  private startDate: Date
  private endDate: Date
  private queryExecutor: SearchQueryExecutor
  private apps: AppEntity[] = []
  private cosalBitIds: number[] = []

  constructor(cosal: Cosal, args: SearchQuery) {
    this.args = args
    this.cosal = cosal
    this.log = new Logger('search (' + (args.query ? args.query + ', ' : '') + args.group + ')')
    this.queryExecutor = new SearchQueryExecutor(this.log)
    this.buildDatePeriod()
  }

  /**
   * Resolves search result based on a given search args.
   */
  async resolve() {
    this.log.timer('search', this.args)
    this.apps = await getRepository(AppEntity).find({ spaces: { id: this.args.spaceId } })
    this.cosalBitIds = await this.searchCosalIds()
    const searchResults: SearchResult[] = []

    for (let contentType of BitContentTypes) {
      // this.log.timer('loading ' + contentType)
      const [bits, bitsTotalCount] = await this.searchBits(contentType)
      if (bits.length) {
        const bitAppIds = uniq(bits.map(bit => bit.appId))
        const bitApps = this.apps.filter(app => bitAppIds.indexOf(app.id) !== -1)
        const bitAppNames = bitApps.map(app => app.name).join(', ')
        const bitLocationNames = bits
          .filter(bit => !!bit.location.name)
          .map(bit => bit.location.name)
        const bitAppTypes = bitApps.map(app => app.itemType)
        const text = SearchResultUtils.buildSearchResultText(
          this.args.query,
          bits.map(bit => bit.body),
        )
        const firstBits = this.args.maxBitsCount ? bits.slice(0, this.args.maxBitsCount) : bits

        if (contentType === 'conversation') {
          const title = SearchResultUtils.buildSearchResultTitle(
            bitLocationNames.map(name => '#' + name),
          )
          searchResults.push({
            target: 'search-group',
            id: Math.random(),
            group: this.args.group,
            title: 'Conversations in ' + title,
            contentType,
            text,
            bitsTotalCount,
            bits: firstBits,
          })
        } else if (contentType === 'thread') {
          searchResults.push({
            target: 'search-group',
            id: Math.random(),
            group: this.args.group,
            title: 'Emails in ' + bitAppNames,
            contentType,
            text,
            bitsTotalCount,
            bits: firstBits,
          })
        } else if (contentType === 'document') {
          const title = SearchResultUtils.buildSearchResultTitle(bitLocationNames)
          searchResults.push({
            target: 'search-group',
            id: Math.random(),
            group: this.args.group,
            title: 'Documents in ' + (title ? title : bitAppNames),
            contentType,
            text,
            bitsTotalCount,
            bits: firstBits,
          })
        } else if (contentType === 'task') {
          searchResults.push({
            target: 'search-group',
            id: Math.random(),
            group: this.args.group,
            title: 'Tasks from ' + bitAppTypes,
            contentType,
            text,
            bitsTotalCount,
            bits: firstBits,
          })
        } else if (contentType === 'website') {
          searchResults.push({
            target: 'search-group',
            id: Math.random(),
            group: this.args.group,
            title: 'Pages from ' + bitAppNames,
            contentType,
            text,
            bitsTotalCount,
            bits: firstBits,
          })
        }
      }
      // this.log.timer('loading ' + contentType)
    }

    this.log.timer('search results length', searchResults.length)
    return searchResults
  }

  /**
   * Searches in cosal.
   */
  private async searchCosalIds(): Promise<number[]> {
    // const otherFilters = `${(this.args.peopleFilters || []).join(' ')} ${(this.args.locationFilters || []).join(' ')}`
    const query = this.args.query
    if (!query) {
      return []
    }
    this.log.timer('search in cosal', query)
    const results = await this.cosal.search(query, Math.max(300, this.args.take))

    let ids = []
    // distance is "relevancy", we can adjust this with testing
    const lastIndex = results.findIndex(x => x.distance > 0.5)
    if (lastIndex > 0) {
      ids = results.slice(0, lastIndex).map(x => x.id)
    }
    this.log.timer('search in cosal', ids)
    return ids
  }

  /**
   * Performs a database search on bits.
   */
  private async searchBits(contentType: BitContentType): Promise<[Bit[], number]> {
    const appIds = this.apps.map(app => app.id)
    this.log.info(`search`, this.apps, this.args)

    // parallel search both fts and cosal
    const [ftsResults, cosalResults] = await Promise.all([
      this.queryExecutor.execute({
        ...this.args,
        contentType,
        startDate: this.startDate,
        endDate: this.endDate,
        appIds,
        take: 10,
        skip: 0,
      }),
      this.queryExecutor.execute({
        ...this.args,
        contentType,
        startDate: this.startDate,
        endDate: this.endDate,
        query: undefined,
        ids: this.cosalBitIds,
        appIds,
        take: 10,
        skip: 0,
      }),
    ])

    const [ftsBits, ftsBitsCount] = ftsResults
    const [cosalBits, cosalBitsCount] = await cosalResults

    // results that are found both in cosal and in fts5 search
    // we order into beginning (since they are kinda treated as most accurate)
    const [matchedBits, restBits]: [Bit[], Bit[]] = [[], []]
    for (const ftsBit of ftsBits) {
      if (cosalBits.findIndex(x => x.id === ftsBit.id) > -1) {
        matchedBits.push(ftsBit)
      } else {
        restBits.push(ftsBit)
      }
    }

    // lastly return bits
    const allBits = uniqBy([...matchedBits, ...restBits, ...cosalBits], 'id')
    return [allBits, ftsBitsCount + cosalBitsCount]
  }

  /**
   * Builds a data range period that will be used for a given data group.
   */
  private buildDatePeriod() {
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

    if (this.args.group === 'last-day') {
      this.startDate = dayAgo
    } else if (this.args.group === 'last-week') {
      this.startDate = weekAgo
      this.endDate = dayAgo
    } else if (this.args.group === 'last-month') {
      this.startDate = monthAgo
      this.endDate = weekAgo
    } else if (this.args.group === 'overall') {
      this.endDate = monthAndDayAgo
    }
  }
}
