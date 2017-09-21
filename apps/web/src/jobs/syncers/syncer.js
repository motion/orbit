// @flow
import { ensureJob } from '~/jobs/helpers'
import type { User, Setting } from '@mcro/models'

type SyncOptions = {
  user: User,
}

export default class Syncer {
  static type: string
  static jobs: Object

  JOBS_CHECK_INTERVAL = 1000 * 10 // 10 seconds
  jobWatcher: ?NodeJS.Timer
  user: User

  constructor({ user }: SyncOptions) {
    this.runSyncer()
    this.user = user
  }

  get type(): string {
    return this.constructor.type
  }

  get setting(): ?Setting {
    return this.user.setting[this.type]
  }

  get token(): ?string {
    return this.user.token(this.type)
  }

  runSyncer() {
    // every so often
    this.jobWatcher = setInterval(this.syncJobs, this.JOBS_CHECK_INTERVAL)
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

  ensureSetting() {
    if (!this.setting) {
      throw new Error('No setting found for ' + this.type)
    }
  }

  dispose() {
    if (this.jobWatcher) {
      clearInterval(this.jobWatcher)
    }
  }
}
