import Syncer from '../syncer'
import GoogleDriveSync from './googleDriveSync'
import GoogleCalSync from './googleCalSync'
import * as Constants from '~/constants'
import { URLSearchParams } from 'url'
import r2 from '@mcro/r2'

const getHelpers = setting => ({
  // clientId: Constants.GOOGLE_CLIENT_ID,
  baseUrl: 'https://content.googleapis.com',
  async fetch(
    path,
    {
      headers,
      body,
      query,
      type = 'json',
      isRetrying,
      ...rest
    }: {
      isRetrying?: boolean
      type?: string
      query?: Object
      headers?: Object
      body?: Object
    } = {},
  ) {
    const fetcher = r2.get(
      `${this.baseUrl}${path}${
        query ? `?${new URLSearchParams(Object.entries(query))}` : ''
      }`,
      {
        mode: 'cors',
        ...rest,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Access-Control-Allow-Origin': Constants.API_HOST,
          'Access-Control-Allow-Methods': 'GET',
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
      },
    )
    const res = await fetcher[type]
    if (res.error) {
      if (res.error.code === 401 && !isRetrying) {
        console.log('attempt refresh token')
        // retry if got new token
        if (setting.values.oauth.refreshToken) {
          return await this.fetch(path, {
            headers,
            body,
            query,
            type,
            ...rest,
            isRetrying: true,
          })
        }
        return null
      }
      throw res.error
    }
    if (res.status === 200) {
      return res
    }
    if (res.status === 403) {
      return null
    }
  },
})

export default setting => {
  const helpers = getHelpers(setting)
  return new Syncer('google', {
    setting,
    actions: {
      drive: { every: 60 },
      // cal: { every: 60 * 5 }, // 5 minutes
    },
    syncers: {
      drive: new GoogleDriveSync(setting, helpers),
      cal: new GoogleCalSync(setting, helpers),
    },
  })
}
