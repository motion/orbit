import { Logger } from '@mcro/logger'
import { sleep } from '@mcro/utils'
import { ServiceLoader } from '../../ServiceLoader'
import { ServiceLoadThrottlingOptions } from '../../options'
import { JiraQueries } from './JiraQueries'
import { JiraComment, JiraIssue, JiraUser } from './JiraTypes'
import { AppBit } from '@mcro/models'

/**
 * Loads jira data from its API.
 */
export class JiraLoader {
  private app: AppBit
  private log: Logger
  private loader: ServiceLoader

  constructor(app: AppBit, log?: Logger) {
    this.app = app
    this.log = log || new Logger('service:jira:loader:' + app.id)
    this.loader = new ServiceLoader(this.app, this.log)
  }

  /**
   * Sends test request to the jira api to check settings credentials.
   * Returns void if successful, throws an error if fails.
   */
  async test(): Promise<void> {
    await this.loader.load(JiraQueries.test())
  }

  /**
   * Loads users from the jira api.
   */
  async loadUsers(startAt: number = 0): Promise<JiraUser[]> {
    await sleep(ServiceLoadThrottlingOptions.jira.users)

    const maxResults = 1000
    const users = await this.loader.load(JiraQueries.users(startAt, maxResults))

    // since we can only load max 1000 people per request, we check if we have more people to load
    // then execute recursive call to load next 1000 people. Since users API does not return total
    // number of users we do recursive queries until it returns less then 1000 people (means end of people)
    if (users.length >= maxResults) {
      const nextPageUsers = await this.loadUsers(startAt + maxResults)
      return [...users, ...nextPageUsers]
    }

    return users
  }

  /**
   * Loads jira issues from the jira api.
   */
  async loadIssues(
    cursor: number,
    loadedCount: number,
    handler: (
      issue: JiraIssue,
      cursor?: number,
      loadedCount?: number,
      isLast?: boolean,
    ) => Promise<boolean> | boolean,
  ): Promise<void> {
    await sleep(ServiceLoadThrottlingOptions.jira.issues)

    const maxResults = 100
    const response = await this.loader.load(JiraQueries.issues(cursor, maxResults))
    const hasNextPage = response.total > cursor + maxResults

    // traverse over loaded issues and call streaming function
    for (let i = 0; i < response.issues.length; i++) {
      const issue = response.issues[i]
      try {
        // load content comments
        if (issue.fields.comment.total > 0) {
          issue.comments = await this.loadComments(issue.id)
        } else {
          issue.comments = []
        }

        const isLast = i === response.issues.length - 1 && hasNextPage === false
        const result = await handler(
          issue,
          cursor + maxResults,
          loadedCount + response.issues.length,
          isLast,
        )

        // if callback returned true we don't continue syncing
        if (result === false) {
          this.log.info('stopped issue syncing, no need to sync more', {
            issue,
            index: i,
          })
          return // return from the function, not from the loop!
        }
      } catch (error) {
        this.log.warning('Error during issue handling ', issue, error)
      }
    }

    // since we can only load max 100 issues per request, we check if we have more issues to load
    // then execute recursive call to load next 100 issues. Do it until we reach the end (total)
    if (hasNextPage) {
      await this.loadIssues(cursor + maxResults, loadedCount + response.issues.length, handler)
    }
  }

  /**
   * Loads jira issue's comments.
   */
  private async loadComments(
    issueId: string,
    startAt = 0,
    maxResults = 25,
  ): Promise<JiraComment[]> {
    await sleep(ServiceLoadThrottlingOptions.jira.comments)

    const query = JiraQueries.comments(issueId, startAt, maxResults)
    const response = await this.loader.load(query)
    if (response.comments.length < response.total) {
      return [
        ...response.comments,
        ...(await this.loadComments(issueId, startAt + maxResults, maxResults)),
      ]
    }

    return response.comments
  }
}
