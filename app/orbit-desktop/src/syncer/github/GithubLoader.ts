import { Setting } from '@mcro/models'
import { createApolloFetch } from 'apollo-fetch'
import { GithubIssueQueryResult, GithubPeopleQueryResult } from './GithubTypes'
import { GithubIssueQuery, GithubPeopleQuery } from './GithubQueries'
import { Logger } from '@mcro/logger'

const log = new Logger('syncer:github:loader')

/**
 * Performs requests GitHub API.
 */
export class GithubLoader {
  setting: Setting
  totalCost: number = 0
  remainingCost: number = 0

  constructor(setting: Setting) {
    this.setting = setting
  }

  async loadIssues(organization: string, repository: string) {
    log.verbose(`loading ${organization}/${repository} github issues`)
    const issues = await this.loadIssueByCursor(organization, repository)
    log.verbose(
      `loading is finished. Loaded ${issues.length} issues. ` +
      `Total query cost: ${this.totalCost}/${this.remainingCost}`,
      issues
    )
    return issues
  }

  async loadPeople(organization: string) {
    log.verbose(`Loading ${organization} people`)
    const people = await this.loadPeopleByCursor(organization)
    log.verbose(
      `Loading is finished. Loaded ${people.length} issues. ` +
      `Total query cost: ${this.totalCost}/${this.remainingCost}`,
      people
    )
    return people
  }

  private async loadIssueByCursor(
    organization: string,
    repository: string,
    cursor?: string,
  ) {

    // send a request to the github and load first/next 100 issues
    const results = await this.fetchFromGitHub<GithubIssueQueryResult>(
      this.setting.token,
      GithubIssueQuery,
      {
        organization,
        repository,
        cursor,
      },
    )

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost
    this.remainingCost = results.rateLimit.remaining

    const edges = results.repository.issues.edges
    const issues = edges.map(edge => edge.node)
    const totalCount = results.repository.issues.totalCount
    log.verbose(`${issues.length} issues were loaded`, results)

    // if there is a next page we execute next query to api to get all repository issues
    // to get next issues we need a cursor from the last loaded edge
    // and tell github to load issues "after" that cursor
    // cursor basically is a token github returns
    if (results.repository.issues.pageInfo.hasNextPage) {
      const lastEdgeCursor = edges[edges.length - 1].cursor
      log.verbose(`loading next 100 github issues. Total count is ${totalCount}`)
      const nextPageIssues = await this.loadIssueByCursor(organization, repository, lastEdgeCursor)
      return [...issues, ...nextPageIssues]
    }

    return issues
  }

  private async loadPeopleByCursor(organization: string, cursor?: string) {
    // send a request to the github and load first/next 100 people
    log.verbose(`Loading ${cursor ? 'next' : 'first'} 100 people`)
    const results = await this.fetchFromGitHub<GithubPeopleQueryResult>(
      this.setting.token,
      GithubPeopleQuery,
      {
        organization,
        cursor,
      },
    )

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost
    this.remainingCost = results.rateLimit.remaining

    const edges = results.organization.members.edges
    const issues = edges.map(edge => edge.node)
    if (!cursor) {
      log.verbose(`${issues.length} people were loaded`)
      log.verbose(`There are ${results.organization.members.totalCount} people in the repository`)
    } else {
      log.verbose(`Next ${issues.length} people were loaded`)
    }

    // if there is a next page we execute next query to api to get all repository people
    // to get next people we need a cursor from the last loaded edge
    // and tell github to load people "after" that cursor
    // cursor basically is a token github returns
    if (results.organization.members.pageInfo.hasNextPage) {
      const lastEdgeCursor = edges[edges.length - 1].cursor
      const nextPageIssues = await this.loadPeopleByCursor(lastEdgeCursor)
      return [...issues, ...nextPageIssues]
    }

    return issues
  }

  private async fetchFromGitHub<T>(token: string, query: string, variables: object): Promise<T> {
    // todo: replace with fetch here
    const queryName = query
      .substr(0, query.indexOf('(') !== -1 ? query.indexOf('(') : query.length)
      .replace('query', '')
      .replace('mutation', '')
      .trim()
      .concat("(", JSON.stringify(variables), ")")

    const uri = 'https://api.github.com/graphql'
    log.verbose(`request to ${uri}?${queryName}`)
    const results = createApolloFetch({
      uri: 'https://api.github.com/graphql',
    }).use(({ options }, next) => {
      if (!options.headers) {
        options.headers = {}
      }
      options.headers['Authorization'] = `bearer ${token}`
      next()
    })({ query, variables })

    if ((results as any).message) {
      throw new Error(results as any)
    }
    return results.then(results => {
      if (results.errors) {
        // log.error(`error requesting ${uri}?${queryName}`, results.errors)
        throw new Error(JSON.stringify(results))
      }

      // log.verbose(`result of ${uri}?${queryName}`, results.data)
      return results.data
    })
  }

}
