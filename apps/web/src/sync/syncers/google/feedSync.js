// @flow
import { Event } from '~/app'
import GAPI from './api'
import SyncerAction from '../syncerAction'

export default class GoogleFeedSync extends SyncerAction {
  api = new GAPI({ key: this.token })

  run = async () => {
    console.log('run', this.api)
  }
}
