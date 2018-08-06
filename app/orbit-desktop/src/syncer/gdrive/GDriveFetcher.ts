import * as fs from 'fs'
import * as https from 'https'
import { URL } from 'url'
import * as Constants from '@mcro/constants'
import Strategies from '@mcro/oauth-strategies'
import r2 from '@mcro/r2'
import { GDriveFetchQueryOptions } from './GDriveTypes'
import { SettingEntity } from '../../entities/SettingEntity'

/**
 * Fetches data from Google Drive Api.
 */
export class GDriveFetcher {
  private setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  /**
   * Downloads given file.
   */
  downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((ok, fail) => {
      const file = fs.createWriteStream(dest)
      const urlObject = new URL(url)
      https.get(
        {
          protocol: urlObject.protocol,
          host: urlObject.host,
          port: urlObject.port,
          path: urlObject.pathname,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.setting.token}`,
          },
        },
        function(response) {
          response.pipe(file)
          file
            .on('finish', function() {
              file.close()
              ok()
            })
            .on('error', function(err) {
              // Handle errors
              fail(err.message)
            })
        },
      )
    })
  }

  /**
   * Fetches data from google api based on a given query.
   */
  async fetch<R>(options: GDriveFetchQueryOptions<R>): Promise<R> {
    const { url, query, json } = options
    const qs = Object.keys(query)
      .map(key => key + '=' + query[key])
      .join('&')
    const fullUrl = `https://content.googleapis.com/drive/v3${url}?${qs}`
    const response = await fetch(fullUrl, {
      mode: json ? 'cors' : undefined,
      headers: {
        Authorization: `Bearer ${this.setting.token}`,
        'Access-Control-Allow-Origin': Constants.API_URL,
        'Access-Control-Allow-Methods': 'GET',
      },
    })
    const result = json ? await response.json() : await response.text()
    if (result.error && result.error.code === 401 /* && !isRetrying*/) {
      const didRefresh = await this.refreshToken(this.setting)
      if (didRefresh) {
        return await this.fetch(options)
      } else {
        console.error('Couldnt refresh access token :(', result)
        throw result.error
      }
    } else if (result.error) {
      console.log(fullUrl, 'error getting result for', result.error)
      throw result.error
    }
    return result
  }

  /**
   * Refreshes access token used to access google api.
   *
   * todo: need to move this logic into Setting check method,
   * todo: its a setting responsibility to control its access token state
   */
  private async refreshToken(setting: SettingEntity) {
    if (!setting.values.oauth.refreshToken) {
      return null
    }
    const reply = await r2.post('https://www.googleapis.com/oauth2/v4/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      formData: {
        refresh_token: setting.values.oauth.refreshToken,
        client_id: Strategies.gmail.config.credentials.clientID,
        client_secret: Strategies.gmail.config.credentials.clientSecret,
        grant_type: 'refresh_token',
      },
    }).json
    if (reply && reply.access_token) {
      setting.token = reply.access_token
      // @ts-ignore
      await setting.save()
      return true
    }
    return false
  }
}
