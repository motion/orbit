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
  user: User
  activeSyncers = {}
  jobWatcher: ?number

  constructor({ user }: SyncOptions) {
    this.user = user
    this.start()
  }

  start() {
    // setup syncers
    if (this.syncers) {
      this.activeSyncers = {}
      for (const key of Object.keys(this.syncers)) {
        this.activeSyncers[key] = new Syncer(this.setting, this.token)
      }
    }

    // every so often
    this.jobWatcher = setInterval(
      () => this.check(false),
      this.JOBS_CHECK_INTERVAL
    )
    this.check(false)
  }

  async run(action: string) {
    this.ensureSetting()
    await this.activeSyncers[action].run()
  }

  async runAll() {
    await Promise.all(Object.keys(this.syncers).map(x => this.run(x)))
  }

  get setting(): ?Setting {
    return this.user.setting[this.type]
  }

  get token(): ?string {
    return this.user.token(this.type)
  }

  async check(loud: boolean = true) {
    const { type, jobs } = this
    if (!jobs) {
      return
    }
    const syncers = []
    for (const action of Object.keys(jobs)) {
      const job = jobs[action]
      syncers.push(ensureJob(type, action, job, loud))
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
