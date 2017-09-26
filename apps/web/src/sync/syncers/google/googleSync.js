// @flow
import { store } from '@mcro/black/store'
import Syncer from '../syncer'
import GoogleDriveSync from './driveSync'
import GoogleCalSync from './calSync'
import * as Constants from '~/constants'

@store
export default class GoogleSync extends Syncer {
  static settings = {
    type: 'google',
    actions: {
      drive: { every: 60 },
      cal: { every: 60 },
    },
    syncers: {
      drive: GoogleDriveSync,
      cal: GoogleCalSync,
    },
  }

  helpers = {
    clientId: Constants.GOOGLE_CLIENT_ID,
    baseUrl: 'https://content.googleapis.com',
    fetch: async (path: string, opts: Object = {}) => {
      const res = await fetch(
        `${this.helpers.baseUrl}${path}${opts.query
          ? `?${new URLSearchParams(Object.entries(opts.query))}`
          : ''}`,
        {
          method: 'GET',
          mode: 'cors',
          ...opts,
          headers: new Headers({
            Authorization: `Bearer ${this.token}`,
            'Access-Control-Allow-Origin': 'jot.dev',
            'Access-Control-Allow-Methods': 'GET',
            ...opts.headers,
          }),
          body: opts.body ? JSON.stringify(opts.body) : null,
        }
      )

      if (res.status === 200) {
        return await res[opts.type || 'json']()
      }

      if (res.status === 401) {
        // refresh token
        await this.refreshToken()
        // retry
        return await this.helpers.fetch(path, opts)
      }

      throw new Error(`Bad status from fetch: ${res.status} ${res.statusText}`)
    },
  }
}
