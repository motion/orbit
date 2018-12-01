import { Cosal } from '@mcro/cosal'
import { SourceEntity } from '@mcro/models'
import { Logger } from '@mcro/logger'
import { Bit, BitContentTypes, SearchQuery, SearchResult, Source } from '@mcro/models'
import { BitContentType } from '@mcro/models'
import { uniqBy, uniq } from 'lodash'
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
  private sources: Source[] = []
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
    this.sources = await getRepository(SourceEntity).find({ spaces: { id: this.args.spaceId } })
    this.cosalBitIds = await this.searchCosalIds()
    const searchResults: SearchResult[] = []

    for (let contentType of BitContentTypes) {
      this.log.timer('loading ' + contentType)
      const [bits, bitsTotalCount] = await this.search(contentType)
      if (bits.length) {
        const bitSourceIds = uniq(bits.map(bit => bit.sourceId))
        const bitSources = this.sources.filter(source => bitSourceIds.indexOf(source.id) !== -1)
        const bitSourceNames = bitSources.map(source => source.name).join(', ')
        const bitLocationNames = bits
          .filter(bit => !!bit.location.name)
          .map(bit => bit.location.name)
        const bitSourceTypeNames = bitSources.map(source => source.type) // todo: beatify type name
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
            id: Math.random(),
            group: this.args.group,
            title: 'Conversations in ' + title,
            contentType,
            text,
            bitsTotalCount,
            bits: firstBits,
          })
        } else if (contentType === 'mail') {
          searchResults.push({
            id: Math.random(),
            group: this.args.group,
            title: 'Emails in ' + bitSourceNames,
            contentType,
            text,
            bitsTotalCount,
            bits: firstBits,
          })
        } else if (contentType === 'document') {
          const title = SearchResultUtils.buildSearchResultTitle(bitLocationNames)
          searchResults.push({
            id: Math.random(),
            group: this.args.group,
            title: 'Documents in ' + (title ? title : bitSourceNames),
            contentType,
            text,
            bitsTotalCount,
            bits: firstBits,
          })
        } else if (contentType === 'task') {
          searchResults.push({
            id: Math.random(),
            group: this.args.group,
            title: 'Tasks from ' + bitSourceTypeNames,
            contentType,
            text,
            bitsTotalCount,
            bits: firstBits,
          })
        } else if (contentType === 'website') {
          searchResults.push({
            id: Math.random(),
            group: this.args.group,
            title: 'Pages from ' + bitSourceNames,
            contentType,
            text,
            bitsTotalCount,
            bits: firstBits,
          })
        }
      }
      this.log.timer('loading ' + contentType)
    }

    this.log.timer('search', searchResults)
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
    const ids = results.map(x => x.id)
    this.log.timer('search in cosal', { results, ids })
    return ids
  }

  /**
   * Performs an actual database search.
   */
  private async search(contentType: BitContentType): Promise<[Bit[], number]> {
    const sourceIds = this.sources.map(source => source.id)

    // search database using FTS5 search first
    const [ftsBits, ftsBitsCount] = await this.queryExecutor.execute({
      ...this.args,
      contentType,
      startDate: this.startDate,
      endDate: this.endDate,
      sourceIds,
      take: 10,
      skip: 0,
    })

    // now search database with found cosal bit ids
    const [cosalBits, cosalBitsCount] = await this.queryExecutor.execute({
      ...this.args,
      contentType,
      startDate: this.startDate,
      endDate: this.endDate,
      query: undefined,
      ids: this.cosalBitIds,
      sourceIds,
      take: 10,
      skip: 0,
    })

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
