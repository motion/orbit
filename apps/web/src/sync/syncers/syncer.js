// @flow
import * as Helpers from '../helpers'
import type { Setting } from '@mcro/models'
import debug from 'debug'

const log = debug('sync')
const DEFAULT_CHECK_INTERVAL = 1000 * 60 // 1 minute

export default class Syncer {
  // external interface, must set:
  static settings: {
    syncers: Object<string, Object>,
    type: string,
    actions: Object,
  }

  constructor({ user, sync }) {
    this.user = user
    this.sync = sync
  }

  // internal
  syncers = {}
  jobWatcher: ?number

  get settings() {
    return this.constructor.settings
  }

  start() {
    this.createSyncers()

    // every so often
    this.jobWatcher = setInterval(
      () => this.check(false),
      this.settings.checkInterval || DEFAULT_CHECK_INTERVAL
    )
    this.check(false)
  }

  createSyncers() {
    this.watch(() => {
      if (this.setting && this.token) {
        const { syncers } = this.settings

        // setup syncers
        if (syncers) {
          for (const key of Object.keys(syncers)) {
            if (this.syncers[key]) {
              return
            }

            const Syncer = syncers[key]
            if (!Syncer) {
              console.error('no syncer for', key)
            } else {
              this.syncers[key] = new Syncer({
                setting: this.setting,
                token: this.token,
                helpers: this.helpers,
              })

              // helper to make checking syncers easier
              if (!this[key]) {
                this[key] = this.syncers[key]
              }
            }
          }
        }
      }
    })
  }

  async run(action: string) {
    if (!action) {
      throw new Error('Must provide action')
    }
    if (!this.token) {
      console.log('No token found for syncer')
      return
    }
    this.ensureSetting()
    log(`Running ${this.type} ${action}`)
    if (!this.syncers[action]) {
      console.log('NO SYNCER FOUND', action)
    } else {
      await this.syncers[action].run()
    }
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

  async refreshToken() {
    return await this.user.refreshToken(this.type)
  }

  async check(loud: boolean = true): Array<any> {
    const { type, actions } = this
    log('Syncer.check', this.sync.enabled, actions)
    if (!this.sync.enabled) {
      return
    }
    if (!actions) {
      return
    }
    const syncers = []
    for (const action of Object.keys(actions)) {
      const job = actions[action]
      syncers.push(Helpers.ensureJob(type, action, job, loud))
    }
    return await Promise.all(syncers)
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
