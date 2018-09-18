import * as r2 from '@mcro/r2'
import { DriveServiceHelpers, FetchOptions } from './types'
import { getGlobalConfig } from '@mcro/config'
import { GDriveSettingValues } from '@mcro/models'

export const getHelpers = (setting): DriveServiceHelpers => ({
  baseUrl: 'https://content.googleapis.com',
  async refreshToken() {
    const values = setting.values as GDriveSettingValues
    if (!values.oauth.refreshToken) {
      return null
    }
    const reply = await r2.post('https://www.googleapis.com/oauth2/v4/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      formData: {
        refresh_token: values.oauth.refreshToken,
        client_id: values.oauth.clientId,
        client_secret: values.oauth.secret,
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
        'Access-Control-Allow-Origin': `http://localhost:${getGlobalConfig().ports.server}`,
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
      if (err.type === 'invalid-json') {
        // lets try again and get a good error
        const fullError = await fetcher.text
        console.log('fetch JSON parse error, text response:', fullError)
        return null
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
          console.log('Couldnt refresh access toekn :(', res)
          throw res.error
        }
      }
      throw res.error
    }
    return res
  },
})
