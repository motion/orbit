import { Logger } from '@mcro/logger'
import { GithubSetting } from '@mcro/models'
import { sleep } from '@mcro/utils'
import { ServiceLoader } from '../../loader/ServiceLoader'
import { ServiceLoadThrottlingOptions } from '../../options'
import { GithubQueries } from './GithubQueries'
import {
  GithubIssue,
  GithubIssueQueryResult,
  GithubOrganization,
  GithubOrganizationsQueryResult,
  GithubPeopleQueryResult,
  GithubPerson,
  GithubPullRequest,
  GithubPullRequestQueryResult,
  GithubRepository,
  GithubRepositoryQueryResult,
} from './GithubTypes'

/**
 * Performs requests GitHub API.
 */
export class GithubLoader {
  private setting: GithubSetting
  private log: Logger
  private loader: ServiceLoader
  private totalCost: number = 0
  private remainingCost: number = 0

  constructor(setting: GithubSetting, log?: Logger) {
    this.setting = setting
    this.log = log || new Logger('service:github:loader:' + setting.id)
    this.loader = new ServiceLoader(
      this.setting,
      this.log,
      this.baseUrl(),
      this.requestHeaders()
    )
  }

  /**
   * Loads all user organizations.
   */
  async loadOrganizations(): Promise<GithubOrganization[]> {
    this.log.verbose(`loading organizations`)
    const organizations = await this.loadOrganizationsByCursor()
    this.log.verbose(
      `loading is finished. Loaded ${organizations.length} issues. ` +
      `Total query cost: ${this.totalCost}/${this.remainingCost}`,
      organizations
    )
    return organizations
  }

  /**
   * Loads all user repositories.
   */
  async loadRepositories(): Promise<GithubRepository[]> {
    this.log.verbose(`loading repositories`)
    const repositories = await this.loadRepositoriesByCursor()
    this.log.verbose(
      `loading is finished. Loaded ${repositories.length} issues. ` +
      `Total query cost: ${this.totalCost}/${this.remainingCost}`,
      repositories
    )
    return repositories
  }

  /**
   * Loads all issues.
   */
  async loadIssues(organization: string, repository: string): Promise<GithubIssue[]> {
    this.log.verbose(`loading ${organization}/${repository} issues`)
    const issues = await this.loadIssueByCursor(organization, repository)
    this.log.verbose(
      `loading is finished. Loaded ${issues.length} issues. ` +
      `Total query cost: ${this.totalCost}/${this.remainingCost}`,
      issues
    )
    return issues
  }

  /**
   * Loads all pull requests.
   */
  async loadPullRequests(organization: string, repository: string): Promise<GithubPullRequest[]> {
    this.log.verbose(`loading ${organization}/${repository} pull requests`)
    const prs = await this.loadPullRequestsByCursor(organization, repository)
    this.log.verbose(
      `loading is finished. Loaded ${prs.length} pull requests. ` +
      `Total query cost: ${this.totalCost}/${this.remainingCost}`,
      prs
    )
    return prs
  }

  /**
   * Loads github people.
   */
  async loadPeople(organization: string): Promise<GithubPerson[]> {
    this.log.verbose(`Loading ${organization} people`)
    const people = await this.loadPeopleByCursor(organization)
    this.log.verbose(
      `Loading is finished. Loaded ${people.length} issues. ` +
      `Total query cost: ${this.totalCost}/${this.remainingCost}`,
      people
    )
    return people
  }

  private async loadOrganizationsByCursor(
    cursor?: string,
  ): Promise<GithubOrganization[]> {
    await sleep(ServiceLoadThrottlingOptions.github.organizations)

    // send a request to the github and load first/next 100 repositories
    const results = await this.load<GithubOrganizationsQueryResult>(
      GithubQueries.organizations(),
      {
        cursor,
      },
  )

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost
    this.remainingCost = results.rateLimit.remaining

    const edges = results.viewer.organizations.edges
    const organizations = edges.map(edge => edge.node)
    const totalCount = results.viewer.organizations.totalCount
    this.log.verbose(`${organizations.length} organizations were loaded`, results)

    if (results.viewer.organizations.pageInfo.hasNextPage) {
      const lastEdgeCursor = edges[edges.length - 1].cursor
      this.log.verbose(`loading next 100 organizations. Total count is ${totalCount}`)
      const nextPageOrganizations = await this.loadOrganizationsByCursor(lastEdgeCursor)
      return [...organizations, ...nextPageOrganizations]
    }

    return organizations
  }

  private async loadRepositoriesByCursor(
    cursor?: string,
  ): Promise<GithubRepository[]> {
    await sleep(ServiceLoadThrottlingOptions.github.repositories)

    // send a request to the github and load first/next 100 repositories
    const results = await this.load<GithubRepositoryQueryResult>(
      GithubQueries.repositories(),
      {
        cursor,
      },
    )

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost
    this.remainingCost = results.rateLimit.remaining

    const edges = results.viewer.repositories.edges
    const repositories = edges.map(edge => edge.node)
    const totalCount = results.viewer.repositories.totalCount
    this.log.verbose(`${repositories.length} repositories were loaded`, results)

    if (results.viewer.repositories.pageInfo.hasNextPage) {
      const lastEdgeCursor = edges[edges.length - 1].cursor
      this.log.verbose(`loading next 100 repositories. Total count is ${totalCount}`)
      const nextPageRepositories = await this.loadRepositoriesByCursor(lastEdgeCursor)
      return [...repositories, ...nextPageRepositories]
    }

    return repositories
  }

  private async loadIssueByCursor(
    organization: string,
    repository: string,
    cursor?: string,
  ): Promise<GithubIssue[]> {
    await sleep(ServiceLoadThrottlingOptions.github.issues)

    // send a request to the github and load first/next 100 issues
    const results = await this.load<GithubIssueQueryResult>(
      GithubQueries.issues(),
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
    this.log.verbose(`${issues.length} issues were loaded`, results)

    // if there is a next page we execute next query to api to get all repository issues
    // to get next issues we need a cursor from the last loaded edge
    // and tell github to load issues "after" that cursor
    // cursor basically is a token github returns
    if (results.repository.issues.pageInfo.hasNextPage) {
      const lastEdgeCursor = edges[edges.length - 1].cursor
      this.log.verbose(`loading next 100 issues. Total count is ${totalCount}`)
      const nextPageIssues = await this.loadIssueByCursor(organization, repository, lastEdgeCursor)
      return [...issues, ...nextPageIssues]
    }

    return issues
  }

  private async loadPullRequestsByCursor(
    organization: string,
    repository: string,
    cursor?: string,
  ): Promise<GithubPullRequest[]> {
    await sleep(ServiceLoadThrottlingOptions.github.pullRequests)

    // send a request to the github and load first/next 100 issues
    const results = await this.load<GithubPullRequestQueryResult>(
      GithubQueries.pullRequests(),
      {
        organization,
        repository,
        cursor,
      },
    )

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost
    this.remainingCost = results.rateLimit.remaining

    const edges = results.repository.pullRequests.edges
    const prs = edges.map(edge => edge.node)
    const totalCount = results.repository.pullRequests.totalCount
    this.log.verbose(`${prs.length} PRs were loaded`, results)

    // if there is a next page we execute next query to api to get all repository issues
    // to get next issues we need a cursor from the last loaded edge
    // and tell github to load issues "after" that cursor
    // cursor basically is a token github returns
    if (results.repository.pullRequests.pageInfo.hasNextPage) {
      const lastEdgeCursor = edges[edges.length - 1].cursor
      this.log.verbose(`loading next 100 PRs. Total count is ${totalCount}`)
      const nextPagePRs = await this.loadPullRequestsByCursor(organization, repository, lastEdgeCursor)
      return [...prs, ...nextPagePRs]
    }

    return prs
  }

  private async loadPeopleByCursor(organization: string, cursor?: string): Promise<GithubPerson[]> {
    await sleep(ServiceLoadThrottlingOptions.github.users)

    // send a request to the github and load first/next 100 people
    this.log.verbose(`Loading ${cursor ? 'next' : 'first'} 100 people`)
    const results = await this.load<GithubPeopleQueryResult>(
      GithubQueries.people(),
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
      this.log.verbose(`${issues.length} people were loaded`)
      this.log.verbose(`There are ${results.organization.members.totalCount} people in the repository`)
    } else {
      this.log.verbose(`Next ${issues.length} people were loaded`)
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

  /**
   * Builds base url for the service loader queries.
   */
  private baseUrl(): string {
    return 'https://api.github.com/graphql'
  }

  /**
   * Builds request headers for the service loader queries.
   */
  private requestHeaders() {
    return {
      Authorization: `Bearer ${this.setting.token}`
    }
  }

  /**
   * Executes load query.
   */
  private async load<T>(query: string, variables: object): Promise<T> {
    const queryName = query
      .substr(0, query.indexOf('(') !== -1 ? query.indexOf('(') : query.length)
      .replace('query', '')
      .replace('mutation', '')
      .trim()
      .concat('(', JSON.stringify(variables), ')')

    const result: any = await this.loader.load({
      path: '?' + queryName,
      method: 'post',
      body: JSON.stringify({ query, variables })
    })
    console.log(result)
    return result.data
  }

}
