import { logger } from '@mcro/logger'
import { Bit, Person } from '@mcro/models'
import { AtlassianService } from '@mcro/services'
import { SettingEntity } from '../../entities/SettingEntity'
import { queryObjectToQueryString } from '../../utils'
import { JiraComment, JiraCommentCollection, JiraIssue, JiraIssueCollection, JiraUser } from './JiraTypes'

const log = logger('syncer:confluence:loader')

/**
 * Loads jira data from its API.
 */
export class JiraLoader {
  private setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  /**
   * Loads users from the jira api.
   */
  async loadUsers(startAt: number = 0): Promise<JiraUser[]> {
    const maxResults = 1000
    const url = `/rest/api/2/user/search?maxResults=${maxResults}&startAt=${startAt}&username=_`
    const users = await this.fetch<JiraUser[]>(url)

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
    const url = `/rest/api/2/search?maxResults=${maxResults}&startAt=${startAt}`
    const response = await this.fetch<JiraIssueCollection>(url)


    // load content comments
    // for (let issue of response.issues) {
    //   // if (content.childTypes.comment.value === true) {
    //     issue.comments = await this.loadComments(issue.id)
    //   // } else {
    //   //   issue.comments = []
    //   // }
    // }

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

  private async loadComments(issueId: string, startAt = 0, maxResults = 25): Promise<JiraComment[]> {

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
        ...(await this.loadComments(issueId, startAt + maxResults, maxResults))
      ]
    }

    return response.comments
  } */


  /**
   * Performs HTTP request to the atlassian to get requested data.
   */
  private async fetch<T>(
    path: string,
    params?: { [key: string]: any }
  ): Promise<T> {

    const { username, password, domain } = this.setting.values.atlassian
    const credentials = Buffer.from(`${username}:${password}`).toString('base64')
    const qs = queryObjectToQueryString(params)
    const url = `${domain}${path}${qs}`

    log(`performing request to ${url}`)
    const result = await fetch(url, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    })
    log(`request ${url} result:`, result)

    if (!result.ok) {
      throw new Error(
        `[${result.status}] ${result.statusText}: ${await result.text()}`,
      )
    }

    return result.json()
  }

}
