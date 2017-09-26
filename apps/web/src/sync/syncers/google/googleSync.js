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
      drive: { every: 4 },
      cal: { every: 4 },
    },
    syncers: {
      drive: GoogleDriveSync,
      cal: GoogleCalSync,
    },
  }

  helpers = {
    clientId: Constants.GOOGLE_CLIENT_ID,
    baseUrl: 'https://content.googleapis.com',
    fetch: (path: string, opts: Object = {}) =>
      fetch(
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
      ).then(res => res[opts.type || 'json']()),
  }
}
