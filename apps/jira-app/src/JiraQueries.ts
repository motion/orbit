import { ServiceLoaderLoadOptions } from '@o/kit'
import { JiraCommentCollection, JiraIssueCollection, JiraUser } from './JiraModels'

/**
 * Jira queries.
 *
 * https://tryorbit2.atlassian.net
 * natewienert@gmail.com
 * AtlOrbit123
 *
 */
export class JiraQueries {

  /**
   * API test query.
   */
  static test(): ServiceLoaderLoadOptions<JiraUser[]> {
    return {
      path: '/rest/api/2/user/search',
      query: {
        maxResults: 1,
        startAt: 0,
        username: '_',
      }
    }
  }

  /**
   * Search users query.
   */
  static users(startAt: number, maxResults: number): ServiceLoaderLoadOptions<JiraUser[]> {
    return {
      path: '/rest/api/2/user/search',
      query: {
        maxResults,
        startAt,
        username: '_',
      }
    }
  }

  /**
   * Issues search query.
   */
  static issues(startAt: number, maxResults: number): ServiceLoaderLoadOptions<JiraIssueCollection> {
    return {
      path: '/rest/api/2/search',
      query: {
        jql: 'order by updated DESC',
        fields: '*all',
        maxResults,
        startAt,
        expand: 'renderedFields',
      }
    }
  }

  /**
   * Comments search query.
   */
  static comments(issueId: string, startAt: number, maxResults: number): ServiceLoaderLoadOptions<JiraCommentCollection> {
    return {
      path: `/rest/api/2/issue/${issueId}/comment`,
      query: {
        startAt,
        maxResults,
      },
    }
  }

}