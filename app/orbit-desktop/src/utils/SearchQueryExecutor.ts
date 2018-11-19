import { BitEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { Bit, SearchQuery } from '@mcro/models'
import { getConnection } from 'typeorm'
import { SqliteDriver } from 'typeorm/driver/sqlite/SqliteDriver'

/**
 * Executes search query.
 */
export class SearchQueryExecutor {
  private args: SearchQuery
  private log: Logger

  constructor(args: SearchQuery) {
    this.args = args
    this.log = new Logger('search-query-executor')
  }

  /**
   * Executes search query and returns found bits and number of overall bits matched given query.
   */
  async execute(): Promise<[Bit[], number]> {
    this.log.timer(`query`)
    this.log.timer(`loading bits`)
    const [bitsQuery, bitsParameters] = this.buildDbQuery(false)
    const bits = this.rawBitsToBits(await this.runDbQuery(bitsQuery, bitsParameters))
    this.log.timer(`loading bits`, { bitsQuery, bitsParameters, bits })
    this.log.timer(`loading count`)
    const [countQuery, countParameters] = this.buildDbQuery(true)
    const countResult = await this.runDbQuery(countQuery, countParameters)
    this.log.timer(`loading count`, { countQuery, countParameters, countResult })
    this.log.timer(`query`)
    return [bits, countResult[0]['cnt']]
  }

  /**
   * Builds database query based on the search query args.
   * If count is set to true then count will be returned in the results.
   */
  private buildDbQuery(count: boolean): [string, any[]] {
    const joins: string[] = []
    const conditions: string[] = []
    const conditionParameters: any[] = []
    const joinParameters: any[] = []

    let sql = `SELECT `;
    sql += count ? `COUNT(*) as cnt` : `"bit".*`
    sql += ` FROM "bit_entity" "bit" `

    if (this.args.query && this.args.query.length) {
      conditions.push(`"bit"."id" IN (SELECT "rowid" FROM "search_index" WHERE "search_index" MATCH '${this.args.query}')`)
      // conditionParameters.push(`%${query.replace(/\s+/g, '%')}%`)
    } else if (this.args.ids) {
      conditions.push(`"bit"."id" IN (${this.args.ids.join(', ')})`)
    }

    if (this.args.contentType) {
      conditions.push(`"bit"."type" = ?`)
      conditionParameters.push(this.args.contentType)
    }
    if (this.args.startDate && this.args.endDate) {
      conditions.push(`"bit"."bitCreatedAt" BETWEEN ? AND ?`)
      conditionParameters.push(new Date(this.args.startDate).getTime())
      conditionParameters.push(new Date(this.args.endDate).getTime())

    } else if (this.args.startDate) {
      conditions.push(`"bit"."bitCreatedAt" > ?`)
      conditionParameters.push(new Date(this.args.startDate).getTime())

    } else if (this.args.endDate) {
      conditions.push(`"bit"."bitCreatedAt" < ?`)
      conditionParameters.push(new Date(this.args.endDate).getTime())
    }
    if (this.args.integrationFilters && this.args.integrationFilters.length) {
      conditions.push(`"bit"."integration" IN (${this.args.integrationFilters.map(() => '?')}`)
      conditionParameters.push(...this.args.integrationFilters)
    }
    if (this.args.sourceId) {
      conditions.push(`"bit"."sourceId" = ?`)
      conditionParameters.push(this.args.sourceId)
    }
    if (this.args.spaceId) {
      conditions.push(`"bit"."spaceId" = ?`)
      conditionParameters.push(this.args.spaceId)
    }

    // if (peopleFilters && peopleFilters.length) {
    //   joins.push(`INNER JOIN "source" "source" ON "source"."spaceId" = ?`)
    //   joinParameters.push(sourceId)
    //
    //   conditions.push("(" + peopleFilters.map(name => {
    //     conditionParameters.push(name)
    //     return `"bit"."locationName" = ?`
    //   }).join(" OR ") + ")")
    //
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

    if (this.args.locationFilters && this.args.locationFilters.length) {
      conditions.push('(' + this.args.locationFilters.map(location => {
        conditionParameters.push(location)
        return `"bit"."locationName" = ?`
      }).join(' OR ') + ')')
    }

    if (joins.length) {
      sql += joins.join(' ')
    }

    if (conditions.length) {
      sql += ` WHERE ` + conditions.join(' AND ')
    }
    sql += ` ORDER BY "bit"."bitCreatedAt" DESC`

    if (this.args.skip && count === false) {
      sql += ` OFFSET ${this.args.skip}`
    }

    if (this.args.take && count === false) {
      sql += ` LIMIT ${this.args.take}`
    }

    return [sql, [...joinParameters, ...conditionParameters]]
  }

  /**
   * Executes query in the database directly through sqlite driver (without orm)
   * to maximize query performance.
   */
  private runDbQuery(query: string, parameters: any[]): Promise<any[]> {
    return new Promise<any[]>((ok, fail) => {
      (getConnection().driver as SqliteDriver).databaseConnection.all(query, parameters, (err, results) => {
        if (err) return fail(err)
        ok(results);
      });
    })
  }

  /**
   * Converts raw data returned by the database to real bits we are using in the app.
   */
  private rawBitsToBits(rawBits: {
    authorId: number,
    bitCreatedAt: number,
    bitUpdatedAt: number,
    body: string,
    contentHash: number,
    createdAt: string,
    data: string,
    desktopLink: string,
    id: number,
    integration: string,
    locationDesktoplink: string,
    locationId: string,
    locationName: string,
    locationWeblink: string,
    sourceId: number,
    title: string,
    type: string,
    updatedAt: string,
    webLink: string,
  }[]): Bit[] {
    return rawBits.map(rawBit => {
      return {
        target: "bit",
        authorId: rawBit.authorId,
        bitCreatedAt: rawBit.bitCreatedAt,
        bitUpdatedAt: rawBit.bitCreatedAt,
        body: rawBit.body,
        contentHash: rawBit.contentHash,
        createdAt: new Date(rawBit.createdAt),
        data: rawBit.data ? JSON.parse(rawBit.data) : undefined,
        desktopLink: rawBit.desktopLink,
        id: rawBit.id,
        integration: rawBit.integration,
        location: {
          id: rawBit.locationId,
          name: rawBit.locationName,
          webLink: rawBit.webLink,
          desktopLink: rawBit.desktopLink,
        },
        sourceId: rawBit.sourceId,
        title: rawBit.title,
        type: rawBit.type,
        updatedAt: new Date(rawBit.updatedAt),
        webLink: rawBit.webLink,
      } as Bit
    })
  }

}
