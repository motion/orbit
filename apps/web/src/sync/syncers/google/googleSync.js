// @flow
import { store } from '@mcro/black/store'
import Syncer from '../syncer'
import GoogleFeedSync from './feedSync'
import * as Constants from '~/constants'

@store
export default class GoogleSync extends Syncer {
  static settings = {
    type: 'google',
    actions: {
      feed: { every: 4 },
    },
    syncers: {
      feed: GoogleFeedSync,
    },
  }

  helpers = {
    clientId: Constants.GOOGLE_CLIENT_ID,
    baseUrl: 'https://content.googleapis.com/drive/v2',
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
