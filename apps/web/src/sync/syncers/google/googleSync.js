// @flow
import { store } from '@mcro/black/store'
import Syncer from '../syncer'
import GoogleFeedSync from './feedSync'

@store
export default class GoogleSync extends Syncer {
  static type = 'google'
  static actions = {
    feed: { every: 60 },
  }
  static syncers = {
    feed: GoogleFeedSync,
  }
}
