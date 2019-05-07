import { AppBit, Logger, ServiceLoader, sleep } from '@o/kit'

import { JiraAppData, JiraComment, JiraIssue, JiraUser } from './JiraModels'
import { JiraQueries } from './JiraQueries'

/**
 * Defines a loading throttling.
 * This is required to not overload user network with service queries.
 */
const THROTTLING = {
  /**
   * Delay before users load.
   */
  users: 100,

  /**
   * Delay before issues load.
   */
  issues: 100,

  /**
   * Delay before issue comments load.
   */
  comments: 100,
}

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

    const appData: JiraAppData = this.app.data
    const { username, password } = this.app.data.setup
    const credentials = Buffer.from(`${username}:${password}`).toString('base64')

    this.loader = new ServiceLoader(this.app, this.log, {
      baseUrl: appData.setup.domain,
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    })
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
  async loadUsers(): Promise<JiraUser[]> {
    const loadRecursively = async (startAt: number = 0) => {
      await sleep(THROTTLING.users)

      const maxResults = 1000
      const users = await this.loader.load(JiraQueries.users(startAt, maxResults))

      // since we can only load max 1000 people per request, we check if we have more people to load
      // then execute recursive call to load next 1000 people. Since users API does not return total
      // number of users we do recursive queries until it returns less then 1000 people (means end of people)
      if (users.length >= maxResults) {
        const nextPageUsers = await loadRecursively(startAt + maxResults)
        return [...users, ...nextPageUsers]
      }
      return users
    }

    this.log.timer('load API people')
    const users = await loadRecursively(0)
    this.log.timer('load API people', users)

    // we don't need some jira users, like system or bot users
    // so we are filtering them out
    this.log.info("filter out users we don't need")
    const filteredUsers = users.filter(user => {
      const email = user.emailAddress || ''
      const ignoredEmail = '@connect.atlassian.com'
      return email.substr(ignoredEmail.length * -1) !== ignoredEmail
    })
    this.log.info('updated users after filtering', filteredUsers)

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
    const loadRecursively = async (cursor: number, loadedCount: number) => {
      await sleep(THROTTLING.issues)

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
        await loadRecursively(cursor + maxResults, loadedCount + response.issues.length)
      }
    }

    this.log.timer('load issues from API')
    await loadRecursively(cursor, loadedCount)
    this.log.timer('load issues from API')
  }

  /**
   * Loads jira issue's comments.
   */
  private async loadComments(
    issueId: string,
    startAt = 0,
    maxResults = 25,
  ): Promise<JiraComment[]> {
    await sleep(THROTTLING.comments)

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
