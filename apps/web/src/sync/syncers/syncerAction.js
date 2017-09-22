// @flow
import typeof { Syncer } from './syncer'

export default class SyncerAction {
  syncer: Syncer

  constructor(syncer: Syncer) {
    this.syncer = syncer
  }

  get setting() {
    return this.syncer.setting
  }

  get token() {
    return this.syncer.token
  }
}
