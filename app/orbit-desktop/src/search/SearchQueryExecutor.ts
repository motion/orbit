import { Logger } from '@o/logger'
import { Bit, BitContentType, SearchQuery } from '@o/models'
import { getConnection } from 'typeorm'
import { SqliteDriver } from 'typeorm/driver/sqlite/SqliteDriver'

/**
 * Executes search query.
 */
export class SearchQueryExecutor {
  private log: Logger

  constructor(log: Logger) {
    this.log = log
  }

  /**
   * Executes search query and returns found bits and number of overall bits matched given query.
   */
  async execute(args: SearchQuery): Promise<[Bit[], number]> {
    this.log.vtimer('query')

    // load bits count first
    this.log.vtimer('loading count')
    const [countQuery, countParameters] = this.buildDbQuery(args, true)
    const countResult = await this.runDbQuery(countQuery, countParameters)
    const bitsCount = countResult[0]['cnt']
    this.log.vtimer('loading count', { countQuery, countParameters, countResult })

    // load bits (we load in the case if count isn't zero since its pointless to load otherwise)
    let bits: Bit[] = []
    if (bitsCount > 0) {
      this.log.vtimer('loading bits')
      const [bitsQuery, bitsParameters] = this.buildDbQuery(args, false)
      bits = this.rawBitsToBits(await this.runDbQuery(bitsQuery, bitsParameters))
      const bitsLen = bits.length
      this.log.vtimer('loading bits', { bitsQuery, bitsParameters, bitsLen })
    } else {
      this.log.verbose('skip loading bits since count is zero')
    }
    this.log.vtimer('query')
    return [bits, bitsCount]
  }

  /**
   * Builds database query based on the search query args.
   * If count is set to true then count will be returned in the results.
   */
  private buildDbQuery(args: SearchQuery, count: boolean): [string, any[]] {
    const joins: string[] = []
    const conditions: string[] = []
    const conditionParameters: any[] = []
    const joinParameters: any[] = []

    let sql = 'SELECT '
    sql += count ? 'COUNT(*) as cnt' : '"bit".*'
    sql += ' FROM "bit_entity" "bit" '

    if (args.query && args.query.length) {
      conditions.push(
        `"bit"."id" IN (SELECT "rowid" FROM "search_index" WHERE "search_index" MATCH '${
          args.query
        }' ORDER BY rank)`,
      )
      // conditionParameters.push(`%${query.replace(/\s+/g, '%')}%`)
    } else if (args.ids) {
      conditions.push(`"bit"."id" IN (${args.ids.join(', ')})`)
    }

    if (args.contentType) {
      conditions.push('"bit"."type" = ?')
      conditionParameters.push(args.contentType)
    }
    if (args.startDate && args.endDate) {
      conditions.push('"bit"."bitCreatedAt" BETWEEN ? AND ?')
      conditionParameters.push(new Date(args.startDate).getTime())
      conditionParameters.push(new Date(args.endDate).getTime())
    } else if (args.startDate) {
      conditions.push('"bit"."bitCreatedAt" > ?')
      conditionParameters.push(new Date(args.startDate).getTime())
    } else if (args.endDate) {
      conditions.push('"bit"."bitCreatedAt" < ?')
      conditionParameters.push(new Date(args.endDate).getTime())
    }
    if (args.appFilters && args.appFilters.length) {
      conditionParameters.push(...args.appFilters)
    }
    if (args.appId) {
      conditions.push('"bit"."appId" = ?')
      conditionParameters.push(args.appId)
    } else if (args.appIds) {
      conditions.push(`"bit"."appId" IN (${args.appIds.join(', ')})`)
    }

    // const peopleFilters = args.peopleFilters
    // if (peopleFilters && peopleFilters.length) {
    //   joins.push(`INNER JOIN "app" "app" ON "app"."spaceId" = ?`)
    //   joinParameters.push(args.appId)
    //   conditions.push("(" + peopleFilters.map(name => {
    //     conditionParameters.push(name)
    //     return `"bit"."locationName" = ?`
    //   }).join(" OR ") + ")")
    //   // essentially, find at least one person
    //   for (const name of peopleFilters) {
    //     (findOptions.where as FindOptionsWhereCondition<Bit>[]).push({
    //       ...andConditions,
    //       people: {
    //         name: { $like: `%${name}%` },
    //       },
    //     })
    //   }
    // }

    if (args.locationFilters && args.locationFilters.length) {
      conditions.push(
        '(' +
          args.locationFilters
            .map(location => {
              conditionParameters.push(location)
              return '"bit"."locationName" = ?'
            })
            .join(' OR ') +
          ')',
      )
    }

    if (joins.length) {
      sql += joins.join(' ')
    }

    if (conditions.length) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }
    sql += ' ORDER BY "bit"."bitCreatedAt" DESC'

    if (args.skip && count === false) {
      sql += ` OFFSET ${args.skip}`
    }

    if (args.take && count === false) {
      sql += ` LIMIT ${args.take}`
    }

    return [sql, [...joinParameters, ...conditionParameters]]
  }

  /**
   * Executes query in the database directly through sqlite driver (without orm)
   * to maximize query performance.
   */
  private runDbQuery(query: string, parameters: any[]): Promise<any[]> {
    return new Promise<any[]>((ok, fail) => {
      ;(getConnection().driver as SqliteDriver).databaseConnection.all(
        query,
        parameters,
        (err, results) => {
          if (err) return fail(err)
          ok(results)
        },
      )
    })
  }

  /**
   * Converts raw data returned by the database to real bits we are using in the app.
   */
  private rawBitsToBits(
    rawBits: {
      appIdentifier: string
      authorId: number
      bitCreatedAt: number
      bitUpdatedAt: number
      body: string
      contentHash: number
      createdAt: string
      data: string
      desktopLink: string
      id: number
      locationDesktoplink: string
      locationId: string
      locationName: string
      locationWeblink: string
      appId: number
      title: string
      type: string
      updatedAt: string
      webLink: string
    }[],
  ): Bit[] {
    return rawBits.map(rawBit => {
      const bit: Bit = {
        target: 'bit',
        appIdentifier: rawBit.appIdentifier,
        authorId: rawBit.authorId,
        bitCreatedAt: rawBit.bitCreatedAt,
        bitUpdatedAt: rawBit.bitCreatedAt,
        body: rawBit.body,
        contentHash: rawBit.contentHash,
        createdAt: new Date(rawBit.createdAt),
        data: rawBit.data ? JSON.parse(rawBit.data) : undefined,
        desktopLink: rawBit.desktopLink,
        id: rawBit.id,
        location: {
          id: rawBit.locationId,
          name: rawBit.locationName,
          webLink: rawBit.webLink,
          desktopLink: rawBit.desktopLink,
        },
        appId: rawBit.appId,
        title: rawBit.title,
        type: rawBit.type as BitContentType,
        updatedAt: new Date(rawBit.updatedAt),
        webLink: rawBit.webLink,
      }
      return bit
    })
  }
}
