// @flow
import { ensureJob } from '../helpers'
import type { User, Setting } from '@mcro/models'
import debug from 'debug'

const log = debug('sync')

type SyncOptions = {
  user: User,
}

export default class Syncer {
  // external interface, must set:
  static settings: {
    syncers: Object<string, Object>,
    type: string,
    actions: Object,
  }

  // internal
  user: User
  syncers = {}
  jobWatcher: ?number

  constructor({ user }: SyncOptions) {
    this.user = user
  }

  start() {
    log('starting syncer', this.constructor.name)
    const { settings } = this.constructor
    const { syncers } = settings

    // setup syncers
    if (syncers) {
      this.syncers = {}
      for (const key of Object.keys(syncers)) {
        const Syncer = syncers[key]
        this.syncers[key] = new Syncer(this)

        // helper to make checking syncers easier
        if (!this[key]) {
          this[key] = this.syncers[key]
        }
      }
    }

    // every so often
    this.jobWatcher = setInterval(
      () => this.check(false),
      1000 * 10 // 10 seconds
    )
    this.check(false)
  }

  async run(action: string) {
    if (!action) {
      throw new Error('Must provide action')
    }
    this.ensureSetting()
    log(`Running ${this.type} ${action}`)
    await this.syncers[action].run()
  }

  async runAll() {
    await Promise.all(Object.keys(this.syncers).map(x => this.run(x)))
  }

  get type(): string {
    return this.constructor.settings.type
  }

  get actions(): string {
    return this.constructor.settings.actions
  }

  get setting(): ?Setting {
    return this.user.setting[this.type]
  }

  get token(): ?string {
    return this.user.token(this.type)
  }

  async check(loud: boolean = true) {
    const { type, actions } = this
    if (!actions) {
      return
    }
    const syncers = []
    for (const action of Object.keys(actions)) {
      const job = actions[action]
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
    if (super.dispose) {
      super.dispose()
    }
  }
}
