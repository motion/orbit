import { AppBit, Logger, ServiceLoader, sleep } from '@o/kit'

import { ConfluenceAppData, ConfluenceComment, ConfluenceContent, ConfluenceGroup, ConfluenceUser } from './ConfluenceModels'
import { ConfluenceQueries } from './ConfluenceQueries'

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
   * Delay before content load.
   */
  contents: 100,

  /**
   * Delay before issue comments load.
   */
  comments: 100,
}

/**
 * Loads confluence data from its API.
 */
export class ConfluenceLoader {
  private app: AppBit
  private log: Logger
  private loader: ServiceLoader

  constructor(app: AppBit, log?: Logger) {
    this.app = app
    this.log = log || new Logger('service:confluence:loader:' + app.id)

    const appData: ConfluenceAppData = this.app.data
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
    const loadRecursively = async (cursor: number, loadedCount: number) => {
      await sleep(THROTTLING.contents)

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
          const result = await handler(
            content,
            cursor + maxResults,
            loadedCount + response.results.length,
            isLast,
          )

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
        await loadRecursively(cursor + maxResults, loadedCount + response.results.length)
      }
    }

    this.log.timer(`sync ${type}s`)
    await loadRecursively(cursor, loadedCount)
    this.log.timer(`sync ${type}s`)
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
    await sleep(THROTTLING.comments)
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
    this.log.info('loading confluence API users')

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
    this.log.info('got confluence API users', users)

    // we don't need some confluence users, like system or bot users
    // so we are filtering them out
    this.log.info("filter out users we don't need")
    const filteredUsers = users.filter(member => {
      const email = member.details.personal.email || ''
      const ignoredEmail = '@connect.atlassian.com'
      return email.substr(ignoredEmail.length * -1) !== ignoredEmail
    })
    this.log.info('updated users after filtering', filteredUsers)

    return filteredUsers
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
    await sleep(THROTTLING.users)

    const response = await this.loader.load(ConfluenceQueries.groupMembers(groupName))
    if (response.results.length < response.size) {
      return [
        ...response.results,
        ...(await this.loadGroupMembers(groupName, start + limit, limit)),
      ]
    }

    return response.results
  }
}
