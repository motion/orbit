import { Cosal } from '@o/cosal'
import { Logger } from '@o/logger'
import { AppEntity, Bit, BitEntity, SearchQuery } from '@o/models'
import { uniqBy } from 'lodash'
import { getRepository } from 'typeorm'

import { SearchQueryExecutor } from '../search/SearchQueryExecutor'

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

  constructor(cosal: Cosal) {
    this.cosal = cosal
  }

  /**
   * Resolves search result based on a given search args.
   */
  async execute(args: SearchQuery) {
    this.args = args
    this.log = new Logger('search (' + (args.query ? args.query + ', ' : '') + ')')
    this.queryExecutor = new SearchQueryExecutor(this.log)
    this.log.vtimer('search', this.args)
    this.apps = await getRepository(AppEntity).find({ spaces: { id: this.args.spaceId } })
    this.cosalBitIds = await this.searchCosalIds()
    const bits = await this.searchBits()
    this.log.vtimer('search', bits.length)
    return bits
  }

  /**
   * Searches in cosal.
   */
  private async searchCosalIds(): Promise<number[]> {
    const query = this.args.query
    if (!query) {
      return []
    }
    this.log.vtimer('search in cosal', query)
    const results = await this.cosal.search(query, Math.max(300, this.args.take))
    let ids = []
    // distance is "relevancy", we can adjust this with testing
    const lastIndex = results.findIndex(x => x.distance > 0.5)
    if (lastIndex > 0) {
      ids = results.slice(0, lastIndex).map(x => x.id)
    }
    this.log.vtimer('search in cosal', ids)
    return ids
  }

  /**
   * Performs a database search on bits.
   */
  private async searchBits(): Promise<Bit[]> {
    const appIds = this.apps.map(app => app.id)
    this.log.verbose(`search, num apps`, this.apps.length, this.args)

    // find exact matches
    const exactBitIds = this.args.query
      ? await getRepository(BitEntity).find({
          select: ['id'],
          where: {
            title: {
              $like: `%${this.args.query}%`.toLowerCase(),
            },
          },
          take: 10,
        })
      : []

    // parallel search
    const [exactResults, ftsResults, cosalResults] = await Promise.all([
      this.queryExecutor.execute({
        ...this.args,
        startDate: this.startDate,
        endDate: this.endDate,
        query: undefined,
        ids: exactBitIds.map(x => x.id),
        appIds,
        take: 10,
        skip: 0,
      }),
      this.queryExecutor.execute({
        ...this.args,
        startDate: this.startDate,
        endDate: this.endDate,
        appIds,
        take: 60,
        skip: 0,
      }),
      this.queryExecutor.execute({
        ...this.args,
        startDate: this.startDate,
        endDate: this.endDate,
        query: undefined,
        ids: this.cosalBitIds,
        appIds,
        take: 60,
        skip: 0,
      }),
    ])

    const [exactBits] = exactResults
    const [ftsBits] = ftsResults
    const [cosalBits] = await cosalResults

    // results that are found both in cosal and in fts5 search
    // we order into beginning (since they are kinda treated as most accurate)
    const [matchedBits, restBits]: [Bit[], Bit[]] = [[], []]
    for (const ftsBit of ftsBits) {
      if (ftsBit.type === 'person') {
        matchedBits.push(ftsBit)
      } else {
        if (cosalBits.findIndex(x => x.id === ftsBit.id) > -1) {
          matchedBits.push(ftsBit)
        } else {
          restBits.push(ftsBit)
        }
      }
    }

    // lastly return bits
    const allBits = uniqBy([...exactBits, ...matchedBits, ...restBits, ...cosalBits], 'id')
    return allBits
  }
}
