import { logger } from '@mcro/logger'
import { Bit, ConfluenceSettingValues, Person } from '@mcro/models'
import { SettingEntity } from '../../entities/SettingEntity'
import { queryObjectToQueryString } from '../../utils'
import {
  ConfluenceCollection,
  ConfluenceComment,
  ConfluenceContent,
  ConfluenceGroup,
  ConfluenceUser,
} from './ConfluenceTypes'

const log = logger('syncer:confluence:loader')

/**
 * Loads confluence data from its API.
 */
export class ConfluenceLoader {
  private setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  /**
   * Sends test request to the confluence api to check settings credentials.
   * Returns void if successful, throws an error if fails.
   */
  async test(): Promise<void> {
    await this.fetch<ConfluenceCollection<ConfluenceContent>>('/wiki/rest/api/content', {
      limit: 1,
      start: 0,
    })
  }

  /**
   * Loads confluence contents (pages).
   *
   * @see https://developer.atlassian.com/cloud/confluence/rest/#api-content-get
   */
  async loadContents(
    type?: 'page' | 'blogpost',
    start = 0,
    limit = 25,
  ): Promise<ConfluenceContent[]> {
    // without type specified we load everything
    if (!type) {
      return Promise.all([
        ...(await this.loadContents('page', start, limit)),
        ...(await this.loadContents('blogpost', start, limit)),
      ])
    }

    // scopes we use here:
    // 1. childTypes.all - used to get information if content has comments
    // 2. history.contributors.publishers - used to get people ids who edited content
    // 3. space - used to get "location/directory" of the page
    // 4. body.styled_view - used to get bit body / page content (with html styles included)

    const response = await this.fetch<ConfluenceCollection<ConfluenceContent>>(
      '/wiki/rest/api/content',
      {
        type,
        start,
        limit,
        expand:
          'childTypes.all,space,body.styled_view,history,history.lastUpdated,history.contributors,history.contributors.publishers',
      },
    )

    // load content comments
    for (let content of response.results) {
      if (content.childTypes.comment.value === true) {
        content.comments = await this.loadComments(content.id)
      } else {
        content.comments = []
      }
    }

    // load recursively to get all content from all "pages"
    if (response.results.length < response.size) {
      return [
        ...response.results,
        ...(await this.loadContents(type, start + limit, limit)),
      ]
    }

    return response.results
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
    // scopes we use here:
    // 1. history.createdBy - used to get comment author

    const response = await this.fetch<ConfluenceCollection<ConfluenceComment>>(
      `/wiki/rest/api/content/${contentId}/child/comment`,
      {
        start,
        limit,
        expand: 'history.createdBy',
      },
    )
    if (response.results.length < response.size) {
      return [
        ...response.results,
        ...(await this.loadComments(contentId, start + limit, limit)),
      ]
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
    const response = await this.fetch<ConfluenceCollection<ConfluenceGroup>>(
      '/wiki/rest/api/group',
    )
    if (response.results.length < response.size) {
      return [
        ...response.results,
        ...(await this.loadGroups(start + limit, limit)),
      ]
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
    const response = await this.fetch<ConfluenceCollection<ConfluenceUser>>(
      `/wiki/rest/api/group/${groupName}/member`,
      { expand: 'operations,details.personal' },
    )
    if (response.results.length < response.size) {
      return [
        ...response.results,
        ...(await this.loadGroupMembers(groupName, start + limit, limit)),
      ]
    }

    return response.results
  }

  /**
   * Performs HTTP request to the atlassian to get requested data.
   */
  private async fetch<T>(
    path: string,
    params?: { [key: string]: any },
  ): Promise<T> {
    const values = this.setting.values as ConfluenceSettingValues
    const { username, password, domain } = values.credentials
    const credentials = Buffer.from(`${username}:${password}`).toString(
      'base64',
    )
    const qs = queryObjectToQueryString(params)
    const url = `${domain}${path}${qs}`

    log(`performing request to ${url}`)
    const result = await fetch(url, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    })
    log(`request ${url} result ok:`, result.ok)
    if (!result.ok)
      throw new Error(
        `[${result.status}] ${result.statusText}: ${await result.text()}`,
      )

    return result.json()
  }
}
