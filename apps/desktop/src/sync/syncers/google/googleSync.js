// @flow
import Syncer from '../syncer'
import GoogleDriveSync from './googleDriveSync'
import GoogleCalSync from './googleCalSync'
import * as Constants from '~/constants'

export default new Syncer({
  type: 'google',
  actions: {
    // drive: { every: 60 },
    cal: { every: 60 * 5 }, // 5 minutes
  },
  syncers: {
    drive: GoogleDriveSync,
    cal: GoogleCalSync,
  },
  props: ({ user }) => ({
    helpers: {
      clientId: Constants.GOOGLE_CLIENT_ID,
      baseUrl: 'https://content.googleapis.com',
      fetch: async (path: string, opts: Object = {}) => {
        const res = await fetch(
          `${this.helpers.baseUrl}${path}${
            opts.query
              ? `?${new URLSearchParams(Object.entries(opts.query))}`
              : ''
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
          // refresh token
          const token = await user.refreshToken('google')
          // retry if got new token
          if (token) {
            return await this.helpers.fetch(path, { ...opts, isRetrying: true })
          }
          return null
        }
        // gapi returns json errors
        const { error } = await res.json()
        throw error
      },
    },
  }),
})
