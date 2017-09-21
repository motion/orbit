// @flow
import { ensureJob } from '../helpers'
import type { User, Setting } from '@mcro/models'

type SyncOptions = {
  user: User,
}

export default class Syncer {
  // external interface, must set:
  static syncers: Object<string, Class<any>>
  static type: string
  static jobs: Object

  // internal
  JOBS_CHECK_INTERVAL = 1000 * 10 // 10 seconds
  user: User
  syncers = {}
  jobWatcher: ?number

  constructor({ user }: SyncOptions) {
    this.user = user
    this.start()
  }

  start() {
    const { syncers } = this.constructor

    // setup syncers
    if (syncers) {
      this.syncers = {}
      for (const key of Object.keys(syncers)) {
        const Syncer = syncers[key]
        this.syncers[key] = new Syncer(this.setting, this.token)
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
    await this.syncers[action].run()
  }

  async runAll() {
    await Promise.all(Object.keys(this.syncers).map(x => this.run(x)))
  }

  get type(): string {
    return this.constructor.type
  }

  get jobs(): string {
    return this.constructor.jobs
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
