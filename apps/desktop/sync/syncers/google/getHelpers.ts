import * as Constants from '~/constants'
import { URLSearchParams } from 'url'
import r2 from '@mcro/r2'
import Strategies from '~/server/oauth.strategies'
import Gmail from 'node-gmail-api'

type FetchOptions =
  | undefined
  | {
      isRetrying?: boolean
      type?: string
      query?: Object
      headers?: Object
      body?: Object
    }

export default setting => ({
  // clientId: Constants.GOOGLE_CLIENT_ID,
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
        client_id: Strategies.google.config.credentials.clientID,
        client_secret: Strategies.google.config.credentials.clientSecret,
        grant_type: 'refresh_token',
      },
    }).json
    if (reply && reply.access_token) {
      setting.token = reply.access_token
      await setting.save()
    }
    return null
  },
  batch: setting.token && new Gmail(setting.token),
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
        const accessToken = await this.refreshToken()
        console.log(`trying again after refreshing token`)
        return await this.fetch(path, {
          ...options,
          isRetrying: true,
        })
      }
      throw res.error
    }
    return res
  },
})
