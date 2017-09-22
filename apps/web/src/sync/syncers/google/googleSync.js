// @flow
import { store } from '@mcro/black/store'
import Syncer from '../syncer'
import GoogleFeedSync from './feedSync'
import * as Constants from '~/constants'

@store
export default class GoogleSync extends Syncer {
  static type = 'google'
  static actions = {
    feed: { every: 60 },
  }
  static syncers = {
    feed: GoogleFeedSync,
  }

  clientId = Constants.GOOGLE_CLIENT_ID

  constructor(...args) {
    super(...args)

    // setTimeout(() => {
    //   const gapi = window.gapi
    //   gapi.load('client', async () => {
    //     const opts = {
    //       apiKey: this.token,
    //       scope: ['profile'], // , 'drive'
    //       clientId: Constants.GOOGLE_CLIENT_ID,
    //     }
    //     console.log('init with opts', opts)
    //     await gapi.client.init(opts)

    //     this.api = gapi.client
    //     console.log('set it up', this.api)
    //   })
    // })
  }
}
