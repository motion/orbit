import * as Constants from '@mcro/constants'
import r2 from '@mcro/r2'
import Strategies from '@mcro/oauth-strategies'

export type Revision = {
  id: string
}

export type DriveServiceHelpers = {
  baseUrl: string
  refreshToken: () => Promise<boolean>
  fetch(
    path: string,
    options?: FetchOptions,
  ): Promise<{
    startPageToken?: string
    revisions?: Revision[]
    newStartPageToken?: number
    nextPageToken?: string
    files?: any[]
    changes: any[]
  }>
}

export type FetchOptions =
  | undefined
  | {
      isRetrying?: boolean
      type?: string
      query?: Object
      headers?: Object
      body?: Object
    }

export default (setting): DriveServiceHelpers => ({
  baseUrl: 'https://content.googleapis.com',
  async refreshToken() {
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
      await setting.save()
      return true
    }
    return false
  },
  async fetch(path, options: FetchOptions = {}) {
    const { headers, body, type = 'json', isRetrying, ...rest } = options
    const fetcher = r2.get(`${this.baseUrl}${path}`, {
      mode: 'cors',
      ...rest,
      headers: {
        Authorization: `Bearer ${setting.token}`,
        'Access-Control-Allow-Origin': Constants.API_HOST,
        'Access-Control-Allow-Methods': 'GET',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    })
    const res = await fetcher[type]
    if (res.error) {
      if (res.error.code === 401 && !isRetrying) {
        const didRefresh = await this.refreshToken()
        if (didRefresh) {
          return await this.fetch(path, {
            ...options,
            isRetrying: true,
          })
        } else {
          console.error('Couldnt refresh access toekn :(')
          return null
        }
      }
      throw res.error
    }
    return res
  },
})
