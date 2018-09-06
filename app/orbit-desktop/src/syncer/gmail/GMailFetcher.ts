import { GmailSettingValues } from '@mcro/models'
import * as r2 from '@mcro/r2'
import { logger } from '@mcro/logger'
import { queryObjectToQueryString } from '../../utils'
import { GmailFetchOptions } from './GMailTypes'
import { SettingEntity } from '../../entities/SettingEntity'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()
const log = logger('syncer:gmail')

export class GMailFetcher {
  setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  async fetch<T>(options: GmailFetchOptions<T>): Promise<T> {
    return this.doFetch('/gmail/v1' + options.url, options.query)
  }

  private async doFetch(
    path,
    query?: { [key: string]: any },
    isRetrying = false,
  ) {
    const url = `https://www.googleapis.com${path}${queryObjectToQueryString(
      query,
    )}`
    log('fetching', url)
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${this.setting.token}`,
        'Access-Control-Allow-Origin': Config.urls.serverHost,
        'Access-Control-Allow-Methods': 'GET',
      },
    })
    const result = await response.json()
    if (result.error) {
      if (
        (result.error.message === 'Invalid Credentials' ||
          result.error.code === 401) &&
        !isRetrying
      ) {
        log('refreshing token')
        const didRefresh = await this.refreshToken()
        if (didRefresh) {
          return await this.doFetch(path, query, true)
        } else {
          console.error('Couldnt refresh access toekn :(!')
          return null
        }
      }
      throw result.error
    }
    return result
  }

  private async refreshToken() {
    const values = this.setting.values as GmailSettingValues
    if (!values.oauth.refreshToken) {
      return null
    }
    const reply = await r2.post('https://www.googleapis.com/oauth2/v4/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      formData: {
        refresh_token: values.oauth.refreshToken,
        client_id: values.oauth.clientID,
        client_secret: values.oauth.clientSecret,
        grant_type: 'refresh_token',
      },
    }).json
    if (reply && reply.access_token) {
      this.setting.token = reply.access_token
      await this.setting.save()
      return true
    }
    return false
  }
}
