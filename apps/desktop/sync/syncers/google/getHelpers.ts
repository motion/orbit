import * as Constants from '~/constants'
import { URLSearchParams } from 'url'
import r2 from '@mcro/r2'

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
  async fetch(
    path,
    {
      headers,
      body,
      query,
      type = 'json',
      isRetrying,
      ...rest
    }: FetchOptions = {},
  ) {
    const fetcher = r2.get(
      `${this.baseUrl}${path}${
        query ? `?${new URLSearchParams(Object.entries(query))}` : ''
      }`,
      {
        mode: 'cors',
        ...rest,
        headers: {
          Authorization: `Bearer ${setting.token}`,
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
        console.log('attempt refresh token', res)
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
    return res
  },
})
