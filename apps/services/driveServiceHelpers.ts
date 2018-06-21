import * as Constants from '@mcro/constants'
import r2 from '@mcro/r2'
import Strategies from '@mcro/oauth-strategies'
import { DriveServiceHelpers, FetchOptions } from './types'

export const getHelpers = (setting): DriveServiceHelpers => ({
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
  async fetch(path, options: FetchOptions = {}): Promise<any> {
    const { headers, mode, body, type = 'json', isRetrying, ...rest } = options
    const fetchOpts = {
      ...rest,
      headers: {
        Authorization: `Bearer ${setting.token}`,
        'Access-Control-Allow-Origin': Constants.API_URL,
        'Access-Control-Allow-Methods': 'GET',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    }
    if (type === 'json') {
      // @ts-ignore
      fetchOpts.mode = mode || 'cors'
    }
    const url = `${this.baseUrl}${path}`
    const fetcher = r2.get(url, fetchOpts)
    let res
    try {
      res = await fetcher[type]
    } catch (err) {
      console.log('got a fetch err', err)
      if (err.type === 'invalid-json') {
        // lets try again and get a good error
        const fullError = await fetcher.text
        console.log('fullError', fullError)
      }
      throw err
    }
    if (res.error) {
      if (res.error.code === 401 && !isRetrying) {
        const didRefresh = await this.refreshToken()
        if (didRefresh) {
          return await this.fetch(path, {
            ...options,
            isRetrying: true,
          })
        } else {
          console.error('Couldnt refresh access toekn :(', res)
          throw res.error
        }
      }
      throw res.error
    }
    return res
  },
})
