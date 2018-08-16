import { logger } from '@mcro/logger'
import { Bit, Person } from '@mcro/models'
import { AtlassianService } from '@mcro/services'
import { SettingEntity } from '../../entities/SettingEntity'
import { queryObjectToQueryString } from '../../utils'
import {
  ConfluenceContent,
  ConfluenceContentResponse, ConfluenceGroup,
  ConfluenceGroupResponse,
  ConfluenceMemberResponse,
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
   * Loads confluence contents (pages).
   *
   * @see https://developer.atlassian.com/cloud/confluence/rest/#api-content-get
   */
  async loadContents(start = 0, limit = 25): Promise<ConfluenceContent[]> {
    const response = await this.fetch<ConfluenceContentResponse>(
      `/wiki/rest/api/content`,
      {
        start,
        limit,
        expand: 'children.comment,space,body.storage,history,history.lastUpdated'
      },
    )
    if (response.results.length < response.size) {
      return [
        ...response.results,
        ...(await this.loadContents(start + limit, limit))
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
      users.push(...(await this.loadGroupMembers(group.name)))
    }
    return users
  }

  /**
   * Loads user groups used to extract confluence members.
   *
   * @see https://developer.atlassian.com/cloud/confluence/rest/#api-group-get
   */
  private async loadGroups(start = 0, limit = 200): Promise<ConfluenceGroup[]> {
    const response = await this.fetch<ConfluenceGroupResponse>(
      `/wiki/rest/api/group`
    )
    if (response.results.length < response.size) {
      return [
        ...response.results,
        ...(await this.loadGroups(start + limit, limit))
      ]
    }

    return response.results
  }

  /**
   * Loads user group members.
   *
   * @see https://developer.atlassian.com/cloud/confluence/rest/#api-group-get
   */
  private async loadGroupMembers(groupName: string, start = 0, limit = 200): Promise<ConfluenceUser[]> {

    const response = await this.fetch<ConfluenceMemberResponse>(
      `/wiki/rest/api/group/${groupName}/member`,
      { expand: 'operations,details.personal' },
    )
    if (response.results.length < response.size) {
      return [
        ...response.results,
        ...(await this.loadGroupMembers(groupName, start + limit, limit))
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
    if (!result.ok)
      throw new Error(`[${result.status}] ${result.statusText}: ${await result.text()}`)

    return result.json()
  }

}
