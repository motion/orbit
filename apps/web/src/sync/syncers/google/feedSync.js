// @flow
import { Event } from '~/app'
import SyncerAction from '../syncerAction'

export default class GoogleFeedSync extends SyncerAction {
  run = async () => {
    console.log('run google feed')
    this.changeToken = await this.helpers.fetch('/changes/startPageToken')
  }
}
