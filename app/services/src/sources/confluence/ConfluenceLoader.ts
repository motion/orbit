import { Logger } from '@mcro/logger'
import { sleep } from '@mcro/utils'
import { ConfluenceSource } from '@mcro/models'
import { ServiceLoader } from '../../loader/ServiceLoader'
import { ServiceLoadThrottlingOptions } from '../../options'
import { ConfluenceQueries } from './ConfluenceQueries'
import {
  ConfluenceComment,
  ConfluenceContent,
  ConfluenceGroup,
  ConfluenceUser,
} from './ConfluenceTypes'

/**
 * Loads confluence data from its API.
 */
export class ConfluenceLoader {
  private source: ConfluenceSource
  private log: Logger
  private loader: ServiceLoader

  constructor(setting: ConfluenceSource, log?: Logger) {
    this.source = setting
    this.log = log || new Logger('service:confluence:loader:' + setting.id)
    this.loader = new ServiceLoader(this.source, this.log, this.baseUrl(), this.requestHeaders())
  }

  /**
   * Sends test request to the confluence api to check settings credentials.
   * Returns void if successful, throws an error if fails.
   */
  async test(): Promise<void> {
    await this.loader.load(ConfluenceQueries.test())
  }

  /**
   * Loads confluence contents (pages).
   *
   * @see https://developer.atlassian.com/cloud/confluence/rest/#api-content-get
   */
  async loadContents(
    type: 'page' | 'blogpost',
    cursor: number,
    loadedCount: number,
    handler: (
      content: ConfluenceContent,
      cursor?: number,
      loadedCount?: number,
      isLast?: boolean,
    ) => Promise<boolean> | boolean,
  ): Promise<void> {
    await sleep(ServiceLoadThrottlingOptions.confluence.contents)

    const maxResults = 25
    const response = await this.loader.load(ConfluenceQueries.contents(type, cursor, maxResults))
    const hasNextPage = response.size > cursor + maxResults

    // traverse over loaded issues and call streaming function
    for (let i = 0; i < response.results.length; i++) {
      const content = response.results[i]
      try {

        // load content comments
        if (content.childTypes.comment.value === true) {
          content.comments = await this.loadComments(content.id)
        } else {
          content.comments = []
        }

        const isLast = i === response.results.length - 1 && hasNextPage === false
        const result = await handler(content, cursor + maxResults, loadedCount + response.results.length, isLast)

        // if callback returned true we don't continue syncing
        if (result === false) {
          this.log.info('stopped issue syncing, no need to sync more', {
            issue: content,
            index: i,
          })
          return // return from the function, not from the loop!
        }
      } catch (error) {
        this.log.warning('Error during issue handling ', content, error)
      }
    }

    // since we can only load max 100 pages per request, we check if we have more pages to load
    // then execute recursive call to load next 100 pages. Do it until we reach the end (total)
    if (hasNextPage) {
      await this.loadContents(type, cursor + maxResults, loadedCount + response.results.length, handler)
    }
  }

  /**
   * Loads confluence content's comments.
   *
   * @see https://developer.atlassian.com/cloud/confluence/rest/#api-content-id-child-comment-get
   */
  private async loadComments(
    contentId: string,
    start = 0,
    limit = 25,
  ): Promise<ConfluenceComment[]> {
    await sleep(ServiceLoadThrottlingOptions.confluence.comments)
    // scopes we use here:
    // 1. history.createdBy - used to get comment author

    const response = await this.loader.load(ConfluenceQueries.comments(contentId, start, limit))
    if (response.results.length < response.size) {
      return [...response.results, ...(await this.loadComments(contentId, start + limit, limit))]
    }

    return response.results
  }

  /**
   * Loads confluence users.
   * To load users we first need to load all the user groups then get users from them.
   *
   * @see https://developer.atlassian.com/cloud/confluence/rest/#api-group-groupName-member-get
   */
  async loadUsers(): Promise<ConfluenceUser[]> {
    // get groups first
    const groups = await this.loadGroups()

    // get users from all those groups
    const users: ConfluenceUser[] = []
    for (let group of groups) {
      const members = await this.loadGroupMembers(group.name)
      for (let member of members) {
        // same users can participate in multiple groups, so we exclude duplicates
        const hasSameUser = users.some(user => {
          return user.accountId === member.accountId
        })
        if (hasSameUser === false) users.push(member)
      }
    }
    return users
  }

  /**
   * Loads user groups used to extract confluence members.
   *
   * @see https://developer.atlassian.com/cloud/confluence/rest/#api-group-get
   */
  private async loadGroups(start = 0, limit = 200): Promise<ConfluenceGroup[]> {
    const response = await this.loader.load(ConfluenceQueries.groups())
    if (response.results.length < response.size) {
      return [...response.results, ...(await this.loadGroups(start + limit, limit))]
    }

    return response.results
  }

  /**
   * Loads user group members.
   *
   * @see https://developer.atlassian.com/cloud/confluence/rest/#api-group-get
   */
  private async loadGroupMembers(
    groupName: string,
    start = 0,
    limit = 200,
  ): Promise<ConfluenceUser[]> {
    await sleep(ServiceLoadThrottlingOptions.confluence.users)

    const response = await this.loader.load(ConfluenceQueries.groupMembers(groupName))
    if (response.results.length < response.size) {
      return [
        ...response.results,
        ...(await this.loadGroupMembers(groupName, start + limit, limit)),
      ]
    }

    return response.results
  }

  /**
   * Builds base url for the service loader queries.
   */
  private baseUrl(): string {
    return this.source.values.credentials.domain
  }

  /**
   * Builds request headers for the service loader queries.
   */
  private requestHeaders() {
    const { username, password } = this.source.values.credentials
    const credentials = Buffer.from(`${username}:${password}`).toString('base64')
    return { Authorization: `Basic ${credentials}` }
  }
}
