import { Logger } from '@mcro/logger'
import { JiraSetting } from '@mcro/models'
import { ServiceLoader } from '../loader/ServiceLoader'
import { JiraQueries } from './JiraQueries'
import { JiraComment, JiraIssue, JiraUser } from './JiraTypes'

/**
 * Loads jira data from its API.
 */
export class JiraLoader {
  private setting: JiraSetting
  private log: Logger
  private loader: ServiceLoader

  constructor(setting: JiraSetting, log?: Logger) {
    this.setting = setting
    this.log = log || new Logger('service:jira:loader:' + setting.id)
    this.loader = new ServiceLoader(this.setting, this.log, this.baseUrl(), this.requestHeaders())
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
  async loadIssues(startAt: number = 0): Promise<JiraIssue[]> {
    const maxResults = 100
    const response = await this.loader.load(JiraQueries.issues(startAt, maxResults))

    // load content comments
    for (let issue of response.issues) {
      if (issue.fields.comment.total > 0) {
        issue.comments = await this.loadComments(issue.id)
      } else {
        issue.comments = []
      }
    }

    // since we can only load max 100 issues per request, we check if we have more issues to load
    // then execute recursive call to load next 100 issues. Do it until we reach the end (total)
    if (response.total > startAt + maxResults) {
      const nextPageIssues = await this.loadIssues(startAt + maxResults)
      return [...response.issues, ...nextPageIssues]
    }

    return response.issues
  }

  /**
   * Loads jira issue's comments.
   */
  private async loadComments(issueId: string, startAt = 0, maxResults = 25): Promise<JiraComment[]> {
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

  /**
   * Builds base url for the service loader queries.
   */
  private baseUrl(): string {
    return this.setting.values.credentials.domain
  }

  /**
   * Builds request headers for the service loader queries.
   */
  private requestHeaders() {
    const { username, password } = this.setting.values.credentials
    const credentials = Buffer.from(`${username}:${password}`).toString('base64')
    return { Authorization: `Basic ${credentials}` }
  }

}
