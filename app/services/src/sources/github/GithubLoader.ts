import { Logger } from '@mcro/logger'
import { GithubSource } from '@mcro/models'
import { sleep } from '@mcro/utils'
import { ServiceLoader } from '../../loader/ServiceLoader'
import { ServiceLoadThrottlingOptions } from '../../options'
import { GithubQueries } from './GithubQueries'
import {
  GithubCommentsResponse,
  GithubIssue,
  GithubComment,
  GithubIssueQueryResult,
  GithubOrganization,
  GithubOrganizationsQueryResult,
  GithubPeopleQueryResult,
  GithubPerson,
  GithubPullRequestQueryResult,
  GithubRepository,
  GithubUserRepositoriesQueryResult,
  GithubRepositoryQueryResult,
} from './GithubTypes'

/**
 * Options for loadIssues and loadPullRequests methods.
 */
export interface GithubLoaderIssueOrPullRequestStreamOptions {
  organization: string
  repository: string
  cursor: string
  loadedCount: number
  handler: (
    issue: GithubIssue,
    cursor?: string,
    loadedCount?: number,
    isLast?: boolean,
  ) => Promise<boolean> | boolean
}

/**
 * Performs requests GitHub API.
 */
export class GithubLoader {
  private source: GithubSource
  private log: Logger
  private loader: ServiceLoader
  private totalCost: number = 0
  private remainingCost: number = 0

  constructor(source: GithubSource, log?: Logger) {
    this.source = source
    this.log = log || new Logger('service:github:loader:' + source.id)
    this.loader = new ServiceLoader(this.source, this.log)
  }

  /**
   * Loads all user organizations.
   */
  async loadOrganizations(): Promise<GithubOrganization[]> {
    this.log.verbose('loading organizations')
    const organizations = await this.loadOrganizationsByCursor()
    this.log.verbose(
      `loading is finished. Loaded ${organizations.length} issues. ` +
        `Total query cost: ${this.totalCost}/${this.remainingCost}`,
      organizations,
    )
    return organizations
  }

  /**
   * Loads all user repositories.
   */
  async loadUserRepositories(): Promise<GithubRepository[]> {
    this.log.verbose('loading repositories')
    const repositories = await this.loadRepositoriesByCursor()
    this.log.verbose(
      `loading is finished. Loaded ${repositories.length} issues. ` +
        `Total query cost: ${this.totalCost}/${this.remainingCost}`,
      repositories,
    )
    return repositories
  }

  /**
   * Loads repository information for all given repository names.
   */
  async loadRepositories(names: string[]): Promise<GithubRepository[]> {
    this.log.vtimer('repositories load', names)

    const repositories: GithubRepository[] = []
    for (let name of names) {
      await sleep(ServiceLoadThrottlingOptions.github.repositories)
      const [organization, repositoryName] = name
        .replace('http://github.com/', '')
        .replace('https://github.com/', '')
        .split('/')
      const result = await this.load<GithubRepositoryQueryResult>(GithubQueries.repository(), {
        owner: organization,
        name: repositoryName,
      })
      repositories.push(result.repository)
    }

    this.log.vtimer('repositories load', repositories)
    return repositories
  }

  /**
   * Loads all issues and executes a given callback for each loaded issue.
   */
  async loadIssues(options?: GithubLoaderIssueOrPullRequestStreamOptions): Promise<void> {
    await sleep(ServiceLoadThrottlingOptions.github.issues)

    const { organization, repository, cursor, loadedCount, handler } = options
    const first = 50 // number of issues to load per page
    const results = await this.load<GithubIssueQueryResult>(GithubQueries.issues(), {
      organization,
      repository,
      cursor,
      first,
    })

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost
    this.remainingCost = results.rateLimit.remaining

    const hasNextPage = results.repository.issues.pageInfo.hasNextPage
    const issues = results.repository.issues.nodes
    const totalCount = results.repository.issues.totalCount
    const lastEdgeCursor = hasNextPage ? results.repository.issues.pageInfo.endCursor : undefined
    this.log.verbose(
      `${issues.length} issues were loaded (${loadedCount + issues.length} of ${totalCount})`,
      results,
    )

    // run streaming callback for each loaded issue
    for (let i = 0; i < issues.length; i++) {
      try {
        const isLast = i === issues.length - 1 && hasNextPage === false
        const result = await handler(issues[i], lastEdgeCursor, loadedCount + issues.length, isLast)

        // if callback returned true we don't continue syncing
        if (result === false) {
          this.log.info('stopped issues syncing, no need to sync more', {
            issue: issues[i],
            index: i,
          })
          return // return from the function, not from the loop!
        }
      } catch (error) {
        this.log.warning('error during issue handling', issues[i], error)
      }
    }

    // if there is a next page we execute next query to api to get all repository issues
    // to get next issues we need a cursor from the last loaded edge
    // and tell github to load issues "after" that cursor
    // cursor basically is a token github returns
    if (hasNextPage) {
      await this.loadIssues({
        organization,
        repository,
        cursor: lastEdgeCursor,
        loadedCount: loadedCount + issues.length,
        handler,
      })
    }
  }

  /**
   * Loads all pull requests and executes a given callback for each loaded issue.
   */
  async loadPullRequests(options?: GithubLoaderIssueOrPullRequestStreamOptions): Promise<void> {
    await sleep(ServiceLoadThrottlingOptions.github.pullRequests)

    const { organization, repository, cursor, loadedCount, handler } = options
    const first = 50 // number of issues to load per page
    const results = await this.load<GithubPullRequestQueryResult>(GithubQueries.pullRequests(), {
      organization,
      repository,
      cursor,
      first,
    })

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost
    this.remainingCost = results.rateLimit.remaining

    const hasNextPage = results.repository.pullRequests.pageInfo.hasNextPage
    const pullRequests = results.repository.pullRequests.nodes
    const totalCount = results.repository.pullRequests.totalCount
    const lastEdgeCursor = hasNextPage
      ? results.repository.pullRequests.pageInfo.endCursor
      : undefined
    this.log.verbose(
      `${pullRequests.length} pull request were loaded (${loadedCount +
        pullRequests.length} of ${totalCount})`,
      results,
    )

    // run streaming callback for each loaded issue
    for (let i = 0; i < pullRequests.length; i++) {
      try {
        const isLast = i === pullRequests.length - 1 && hasNextPage === false
        const result = await handler(
          pullRequests[i],
          lastEdgeCursor,
          loadedCount + pullRequests.length,
          isLast,
        )

        // if callback returned true we don't continue syncing
        if (result === false) {
          this.log.info('stopped pull request syncing, no need to sync more', {
            pullRequest: pullRequests[i],
            index: i,
          })
          return // return from the function, not from the loop!
        }
      } catch (error) {
        this.log.warning('Error during pull request handling ', pullRequests[i], error)
      }
    }

    // if there is a next page we execute next query to api to get all repository issues
    // to get next issues we need a cursor from the last loaded edge
    // and tell github to load issues "after" that cursor
    // cursor basically is a token github returns
    if (hasNextPage) {
      await this.loadPullRequests({
        organization,
        repository,
        cursor: lastEdgeCursor,
        loadedCount: loadedCount + pullRequests.length,
        handler,
      })
    }
  }

  /**
   * Loads all issue/pull request comments.
   */
  async loadComments(
    organization: string,
    repository: string,
    issueOrPrNumber: number,
    cursor?: string,
    loadedCount = 0,
  ): Promise<GithubComment[]> {
    await sleep(ServiceLoadThrottlingOptions.github.comments)

    // send a request to the github and load first/next 100 issues
    const first = 100 // number of issues to load per page
    const results = await this.load<GithubCommentsResponse>(GithubQueries.comments(), {
      organization,
      repository,
      cursor,
      first,
      issueOrPrNumber,
    })

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost
    this.remainingCost = results.rateLimit.remaining

    const commentsNode = results.repository.issueOrPullRequest.comments
    const comments = commentsNode.nodes
    const totalCount = commentsNode.totalCount
    loadedCount += comments.length
    this.log.verbose(
      `${comments.length} comments were loaded (${loadedCount} of ${totalCount})`,
      results,
    )

    // if there is a next page we execute next query to api to get all repository issues
    // to get next issues we need a cursor from the last loaded edge
    // and tell github to load issues "after" that cursor
    // cursor basically is a token github returns
    if (commentsNode.pageInfo.hasNextPage) {
      const lastEdgeCursor = commentsNode.pageInfo.endCursor
      const nextPageComments = await this.loadComments(
        organization,
        repository,
        issueOrPrNumber,
        lastEdgeCursor,
        loadedCount,
      )
      return [...comments, ...nextPageComments]
    }

    return comments
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
      people,
    )
    return people
  }

  private async loadOrganizationsByCursor(cursor?: string): Promise<GithubOrganization[]> {
    await sleep(ServiceLoadThrottlingOptions.github.organizations)

    // send a request to the github and load first/next 100 repositories
    const results = await this.load<GithubOrganizationsQueryResult>(GithubQueries.organizations(), {
      cursor,
    })

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

  private async loadRepositoriesByCursor(cursor?: string): Promise<GithubRepository[]> {
    await sleep(ServiceLoadThrottlingOptions.github.repositories)

    // send a request to the github and load first/next 100 repositories
    const results = await this.load<GithubUserRepositoriesQueryResult>(
      GithubQueries.userRepositories(),
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

  private async loadPeopleByCursor(organization: string, cursor?: string): Promise<GithubPerson[]> {
    await sleep(ServiceLoadThrottlingOptions.github.users)

    // send a request to the github and load first/next 100 people
    this.log.verbose(`Loading ${cursor ? 'next' : 'first'} 100 people`)
    const results = await this.load<GithubPeopleQueryResult>(GithubQueries.people(), {
      organization,
      cursor,
    })

    // query was made. calculate total costs
    this.totalCost += results.rateLimit.cost
    this.remainingCost = results.rateLimit.remaining

    const edges = results.organization.members.edges
    const issues = edges.map(edge => edge.node)
    if (!cursor) {
      this.log.verbose(`${issues.length} people were loaded`)
      this.log.verbose(
        `There are ${results.organization.members.totalCount} people in the repository`,
      )
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
      body: JSON.stringify({ query, variables }),
    })
    return result.data
  }
}
