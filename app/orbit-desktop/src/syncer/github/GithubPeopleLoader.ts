import { logger } from '@motion/logger'
import { GithubPeopleQueryResult } from '../../syncer/github/GithubTypes'
import { GithubPeopleQuery } from './GithubQueries'
import { fetchFromGitHub } from './GithubUtils'

const log = logger('syncer:github:people')

/**
 * Loads GitHub people for a single organization.
 */
export class GithubPeopleLoader {
  organization: string
  token: string
  totalCost: number = 0
  remainingCost: number = 0

  constructor(organization: string, token: string) {
    this.organization = organization
    this.token = token
  }

  async load() {
    log(`Loading ${this.organization} people`)
    const people = await this.loadByCursor()
    log(
      `Loading is finished. Loaded ${people.length} issues. Total query cost: ${
        this.totalCost
      }/${this.remainingCost}`,
    )
    return people
  }

  private async loadByCursor(cursor?: string) {
    // send a request to the github and load first/next 100 people
    log(`Loading ${cursor ? 'next' : 'first'} 100 people`)
    const results = await fetchFromGitHub<GithubPeopleQueryResult>(
      this.token,
      GithubPeopleQuery,
      {
        organization: this.organization,
        cursor,
      },
    )

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost
    this.remainingCost = results.rateLimit.remaining

    const edges = results.organization.members.edges
    const issues = edges.map(edge => edge.node)
    if (!cursor) {
      log(`${issues.length} people were loaded`)
      log(
        `There are ${
          results.organization.members.totalCount
        } people in the repository`,
      )
    } else {
      log(`Next ${issues.length} people were loaded`)
    }

    // if there is a next page we execute next query to api to get all repository people
    // to get next people we need a cursor from the last loaded edge
    // and tell github to load people "after" that cursor
    // cursor basically is a token github returns
    if (results.organization.members.pageInfo.hasNextPage) {
      const lastEdgeCursor = edges[edges.length - 1].cursor
      const nextPageIssues = await this.loadByCursor(lastEdgeCursor)
      return [...issues, ...nextPageIssues]
    }

    return issues
  }
}
