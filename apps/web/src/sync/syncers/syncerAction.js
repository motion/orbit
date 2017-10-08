// @flow
import typeof { Syncer } from './syncer'

export default class SyncerAction {
  syncer: Syncer

  constructor(syncer: Syncer) {
    this.syncer = syncer
  }

  createInChunks = async (
    items: Array<any>,
    callback: () => Promise<any>,
    chunk = 10
  ) => {
    let finished = []
    let creating = []
    async function waitForCreating() {
      const successful = (await Promise.all(creating)).filter(Boolean)
      finished = [...finished, ...successful]
      creating = []
    }
    for (const item of items) {
      // pause for every 10 to finish
      if (creating.length === chunk) {
        await waitForCreating()
      }
      creating.push(callback(item))
    }
    await waitForCreating()
    return finished.filter(Boolean)
  }

  get setting() {
    return this.syncer.setting
  }

  get token() {
    return this.syncer.token
  }

  get helpers() {
    return this.syncer.helpers
  }
}
