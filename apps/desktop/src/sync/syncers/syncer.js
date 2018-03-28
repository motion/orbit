// @flow
import * as Helpers from '../helpers'
// import { CurrentUser } from '@mcro/models'

const log = debug('sync')
const DEFAULT_CHECK_INTERVAL = 1000 * 60 // 1 minute

export default class Syncer {
  jobWatcher: ?number

  get type(): string {
    return this.settings.type
  }

  get actions(): string {
    return this.settings.actions
  }

  // async refreshToken() {
  //   return await CurrentUser.refreshToken(this.type)
  // }

  constructor({ settings, syncers, props }) {
    this.settings = settings
    this.syncerModels = syncers
    this.props = props
  }

  start = ({ setting }) => {
    this.setting = setting
    if (!this.token) {
      return
      throw new Error(`No token yo`)
    }
    const { syncerModels } = this
    // setup syncers
    if (syncerModels) {
      for (const key of Object.keys(syncerModels)) {
        if (this.syncers[key]) {
          return
        }
        const Syncer = syncerModels[key]
        if (!Syncer) {
          console.error('no syncer for', key)
        } else {
          try {
            this.syncers[key] = new Syncer({
              setting: this.setting,
              token: this.token,
              ...this.props,
            })
            // helper to make checking syncers easier
            if (!this[key]) {
              this[key] = this.syncers[key]
            }
          } catch (err) {
            log('error creating syncer', key, Syncer)
            console.error(err)
          }
        }
      }
    }
    // every so often
    this.jobWatcher = setInterval(
      () => this.check(false),
      this.settings.checkInterval || DEFAULT_CHECK_INTERVAL,
    )
    this.check(false)
  }

  async run(action: string) {
    if (!action) {
      throw new Error('Must provide action')
    }
    if (!this.token) {
      log(`No token found for syncer ${this.type} ${action}`)
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

  async check(loud: boolean = true): Array<any> {
    const { type, actions } = this
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
  }
}
