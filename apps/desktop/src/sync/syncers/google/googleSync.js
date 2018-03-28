import Syncer from '../syncer'
import GoogleDriveSync from './googleDriveSync'
import GoogleCalSync from './googleCalSync'
import * as Constants from '~/constants'

const getHelpers = setting => ({
  clientId: Constants.GOOGLE_CLIENT_ID,
  baseUrl: 'https://content.googleapis.com',
  fetch: async (refreshToken, path, opts = {}) => {
    const res = await fetch(
      `${this.baseUrl}${path}${
        opts.query ? `?${new URLSearchParams(Object.entries(opts.query))}` : ''
      }`,
      {
        method: 'GET',
        mode: 'cors',
        ...opts,
        headers: new Headers({
          Authorization: `Bearer ${this.token}`,
          'Access-Control-Allow-Origin': Constants.API_HOST,
          'Access-Control-Allow-Methods': 'GET',
          ...opts.headers,
        }),
        body: opts.body ? JSON.stringify(opts.body) : null,
      },
    )
    if (res.status === 200) {
      return await res[opts.type || 'json']()
    }
    if (res.status === 403) {
      return null
    }
    if (res.status === 401 && !opts.isRetrying) {
      // retry if got new token
      if (refreshToken) {
        return await this.fetch(path, { ...opts, isRetrying: true })
      }
      return null
    }
    // gapi returns json errors
    const { error } = await res.json()
    throw error
  },
})

export default setting => {
  const helpers = getHelpers(setting)
  return new Syncer({
    actions: {
      // drive: { every: 60 },
      cal: { every: 60 * 5 }, // 5 minutes
    },
    syncers: {
      drive: new GoogleDriveSync(setting, helpers),
      cal: new GoogleCalSync(setting, helpers),
    },
  })
}
