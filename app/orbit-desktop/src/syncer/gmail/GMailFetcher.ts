import Strategies from '@mcro/oauth-strategies'
import * as r2 from '@mcro/r2'
import { logger } from '@motion/logger'
import * as Constants from '../../constants'
import { queryObjectToQueryString } from '../../utils'
import { GmailFetchOptions } from './GMailTypes'
import { SettingEntity } from '../../entities/SettingEntity'

const log = logger('syncers:gmail')

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
        'Access-Control-Allow-Origin': Constants.API_HOST,
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
    if (!this.setting.values.oauth.refreshToken) {
      return null
    }
    const reply = await r2.post('https://www.googleapis.com/oauth2/v4/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      formData: {
        refresh_token: this.setting.values.oauth.refreshToken,
        client_id: Strategies.gmail.config.credentials.clientID,
        client_secret: Strategies.gmail.config.credentials.clientSecret,
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
