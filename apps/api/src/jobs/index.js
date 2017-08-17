// @flow
import Sync from './jobs/sync'

export default class Jobs {
  sync: Sync

  constructor() {
    this.sync = new Sync()
  }

  async activate() {
    console.log('Starting jobs...')
    await this.sync.activate()
    console.log('Started jobs')
  }

  dispose() {
    console.log('Bye jobs')
    this.sync.dispose()
  }
}
