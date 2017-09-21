// @flow
import { ensureJob } from '~/jobs/helpers'
import typeof { User } from '@mcro/models'

type SyncOptions = {
  user: User,
}

export default class Syncer {
  static type: string
  static jobs: Object

  JOBS_CHECK_INTERVAL = 1000 * 10 // 10 seconds

  constructor({ user }: SyncOptions) {
    this.runSyncer()
    this.user = user
  }

  get type() {
    return this.constructor.type
  }

  get setting(): ?Setting {
    return this.user.setting[this.type]
  }

  get token(): ?string {
    return this.user.token(this.type)
  }

  async runSyncer() {
    // every so often
    setInterval(this.syncJobs, this.JOBS_CHECK_INTERVAL)
    this.syncJobs()
  }

  async syncJobs() {
    const { type, jobs } = this.constructor
    if (!jobs) {
      return
    }
    const syncers = []
    for (const action of Object.keys(jobs)) {
      const job = jobs[action]
      syncers.push(ensureJob(type, action, job))
    }
    await Promise.all(syncers)
  }

  dispose() {}
}
