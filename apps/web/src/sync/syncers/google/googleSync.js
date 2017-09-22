// @flow
import { store } from '@mcro/black/store'
import Syncer from '../syncer'
import GoogleFeedSync from './feedSync'
import * as Constants from '~/constants'
import r2 from '@mcro/r2'

@store
export default class GoogleSync extends Syncer {
  static type = 'google'
  static actions = {
    feed: { every: 60 },
  }
  static syncers = {
    feed: GoogleFeedSync,
  }
  helpers = {
    clientId: Constants.GOOGLE_CLIENT_ID,
    baseUrl: 'https://content.googleapis.com/drive/v3',
    request: (path: string, opts: Object = {}) =>
      fetch(`${this.helpers.baseUrl}${path}`, {
        method: 'GET',
        mode: 'cors',
        ...opts,
        headers: new Headers({
          Authorization: `Bearer ${this.token}`,
          'Access-Control-Allow-Origin': 'jot.dev',
          'Access-Control-Allow-Methods': 'GET',
          ...opts.headers,
        }),
      }),
  }
}
