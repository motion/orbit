import { getGlobalConfig } from '@mcro/config'
import { Logger } from '@mcro/logger'
import { GDriveSettingValues, Setting } from '@mcro/models'
import * as fs from 'fs'
import * as https from 'https'
import { URL } from 'url'
import { DriveFetchQueryOptions } from './DriveTypes'

const Config = getGlobalConfig()
const log = new Logger('service:gdrive:fetcher')

/**
 * Fetches data from Google Drive Api.
 */
export class DriveFetcher {
  private setting: Setting

  constructor(setting: Setting) {
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
  async fetch<R>(options: DriveFetchQueryOptions<R>): Promise<R> {
    const { url, query, json } = options
    const qs = Object.keys(query)
      .map(key => key + '=' + query[key])
      .join('&')
    const fullUrl = `https://content.googleapis.com/drive/v3${url}?${qs}`
    const response = await fetch(fullUrl, {
      mode: json ? 'cors' : undefined,
      headers: {
        Authorization: `Bearer ${this.setting.token}`,
        'Access-Control-Allow-Origin': Config.urls.server,
        'Access-Control-Allow-Methods': 'GET',
      },
    })
    const result = json ? await response.json() : await response.text()
    if (result.error && result.error.code === 401 /* && !isRetrying*/) {
      const didRefresh = await this.refreshToken()
      if (didRefresh) {
        return await this.fetch(options)
      } else {
        console.log('Cannot refresh access token', result)
        throw result.error
      }
    } else if (result.error) {
      log.info(fullUrl, 'error getting result for', result.error)
      throw result.error
    }
    return result
  }

  /**
   * Refreshes OAuth token.
   */
  private async refreshToken() { // todo: create a separate loader component, replacements for r2
    const values = this.setting.values as GDriveSettingValues
    if (!values.oauth.refreshToken) {
      return null
    }

    const formData = {
      refresh_token: values.oauth.refreshToken,
      client_id: values.oauth.clientId,
      client_secret: values.oauth.secret,
      grant_type: 'refresh_token',
    }
    const body = Object
      .keys(formData)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(formData[k])}`)
      .join('&')

    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      body,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const reply = await response.json()
    if (reply.error) {
      throw reply.error

    } else {
      if (reply && reply.access_token) {
        this.setting.token = reply.access_token
        // await this.setting.save() // todo broken after extracting into services
        return true
      }
      return false
    }
  }
}
