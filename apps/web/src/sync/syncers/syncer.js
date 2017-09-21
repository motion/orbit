// @flow
import { ensureJob } from '../helpers'
import type { User, Setting } from '@mcro/models'

type SyncOptions = {
  user: User,
}

export default class Syncer {
  // external interface, must set:
  syncers: Object<string, Class<any>>
  type: string
  jobs: Object

  // internal
  JOBS_CHECK_INTERVAL = 1000 * 10 // 10 seconds
  jobWatcher: ?number
  user: User

  constructor({ user }: SyncOptions) {
    this.start()
    this.user = user
  }

  start() {
    // every so often
    this.jobWatcher = setInterval(this.syncJobs, this.JOBS_CHECK_INTERVAL)
    this.syncJobs()
  }

  async run(action: string) {
    this.ensureSetting()
    const syncer = new this.syncers[action](this.setting, this.token)
    await syncer.run()
  }

  get setting(): ?Setting {
    return this.user.setting[this.type]
  }

  get token(): ?string {
    return this.user.token(this.type)
  }

  async syncJobs() {
    const { type, jobs } = this
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
