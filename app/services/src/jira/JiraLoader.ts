import { Logger } from '@mcro/logger'
import { JiraSettingValues, Setting } from '@mcro/models'
import { queryObjectToQueryString } from '../utils'
import { JiraComment, JiraCommentCollection, JiraIssue, JiraIssueCollection, JiraUser } from './JiraTypes'

const log = new Logger('syncer:jira:loader')

/**
 * Loads jira data from its API.
 */
export class JiraLoader {
  private setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  /**
   * Sends test request to the jira api to check settings credentials.
   * Returns void if successful, throws an error if fails.
   */
  async test(): Promise<void> {
    await this.fetch<JiraUser[]>('/rest/api/2/user/search', {
      maxResults: 1,
      startAt: 0,
      username: '_',
    })
  }

  /**
   * Loads users from the jira api.
   */
  async loadUsers(startAt: number = 0): Promise<JiraUser[]> {
    const maxResults = 1000
    const url = '/rest/api/2/user/search'
    const users = await this.fetch<JiraUser[]>(url, {
      maxResults,
      startAt,
      username: '_',
    })

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
    const url = '/rest/api/2/search'
    const response = await this.fetch<JiraIssueCollection>(url, {
      fields: '*all',
      maxResults,
      startAt,
      expand: 'renderedFields',
    })

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
   *
   * @see https://developer.atlassian.com/cloud/jira/platform/rest/#api-api-2-issue-issueIdOrKey-comment-get
   */
  private async loadComments(
    issueId: string,
    startAt = 0,
    maxResults = 25,
  ): Promise<JiraComment[]> {
    const response = await this.fetch<JiraCommentCollection>(
      `/rest/api/2/issue/${issueId}/comment`,
      {
        startAt,
        maxResults,
      },
    )
    if (response.comments.length < response.total) {
      return [
        ...response.comments,
        ...(await this.loadComments(issueId, startAt + maxResults, maxResults)),
      ]
    }

    return response.comments
  }

  /**
   * Performs HTTP request to the atlassian to get requested data.
   */
  private async fetch<T>(
    path: string,
    params?: { [key: string]: any },
  ): Promise<T> {
    const values = this.setting.values as JiraSettingValues
    const { username, password, domain } = values.credentials
    const credentials = Buffer.from(`${username}:${password}`).toString(
      'base64',
    )
    const qs = queryObjectToQueryString(params)
    const url = `${domain}${path}${qs}`

    log.info(`performing request to ${url}`)
    const result = await fetch(url, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    })
    log.info(`request ${url} result ok:`, result.ok)

    if (!result.ok) {
      throw new Error(
        `[${result.status}] ${result.statusText}: ${await result.text()}`,
      )
    }

    return result.json()
  }
}
