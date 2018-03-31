import * as Helpers from '../helpers'

const log = debug('sync')
const DEFAULT_CHECK_INTERVAL = 1000 * 60 // 1 minute

export default class Syncer {
  get token() {
    return this.setting.token
  }

  constructor(type, { setting, settings = {}, actions, syncers }) {
    this.setting = setting
    this.actions = actions
    this.type = type
    this.syncers = syncers
    this.settings = settings
    // every so often
    this.jobWatcher = setInterval(
      () => this.check(false),
      this.settings.checkInterval || DEFAULT_CHECK_INTERVAL,
    )
    this.check(false)
  }

  run = async action => {
    if (!action) {
      throw new Error('Must provide action')
    }
    if (!this.token) {
      log(`run() no token ${this.type} ${action}`)
      return
    }
    this.ensureSetting()
    log(`run() ${this.type} ${action}`)
    if (!this.actions[action]) {
      console.warn('NO SYNCER FOUND', action)
    } else {
      await this.syncers[action].run()
    }
  }

  async runAll() {
    console.log('this.actions', this.actions)
    await Promise.all(Object.keys(this.actions).map(this.run))
  }

  async check(loud = true) {
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
