import { GithubIssueQueryResult } from '../../syncer/github/GithubTypes'
import { GithubIssueQuery } from './GithubQueries'
import { fetchFromGitHub } from './GithubUtils'
import {logger} from '@motion/logger'

const log = logger('syncers:github:issues')

/**
 * Loads GitHub issues for a single repository.
 */
export class GithubIssueLoader {
  organization: string
  repository: string
  token: string
  totalCost: number = 0
  remainingCost: number = 0

  constructor(organization: string, repository: string, token: string) {
    this.organization = organization
    this.repository = repository
    this.token = token
  }

  async load() {
    log(`loading ${this.organization}/${this.repository} github issues`)
    const issues = await this.loadByCursor()
    log(
      `loading is finished. Loaded ${issues.length} issues. Total query cost: ${
        this.totalCost
      }/${this.remainingCost}`,
    )
    return issues
  }

  private async loadByCursor(cursor?: string) {
    // send a request to the github and load first/next 100 issues
    log(`loading ${cursor ? 'next' : 'first'} 100 github issues`)
    const results = await fetchFromGitHub<GithubIssueQueryResult>(
      this.token,
      GithubIssueQuery,
      {
        organization: this.organization,
        repository: this.repository,
        cursor,
      },
    )

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost
    this.remainingCost = results.rateLimit.remaining

    const edges = results.repository.issues.edges
    const issues = edges.map(edge => edge.node)
    if (!cursor) {
      log(`${issues.length} issues were loaded`)
      log(
        `there are ${
          results.repository.issues.totalCount
        } issues in the repository`,
      )
    } else {
      log(`next ${issues.length} issues were loaded`)
    }

    // if there is a next page we execute next query to api to get all repository issues
    // to get next issues we need a cursor from the last loaded edge
    // and tell github to load issues "after" that cursor
    // cursor basically is a token github returns
    if (results.repository.issues.pageInfo.hasNextPage) {
      const lastEdgeCursor = edges[edges.length - 1].cursor
      const nextPageIssues = await this.loadByCursor(lastEdgeCursor)
      return [...issues, ...nextPageIssues]
    }

    return issues
  }
}
