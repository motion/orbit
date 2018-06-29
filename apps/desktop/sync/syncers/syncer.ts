import * as Helpers from '../helpers'
import debug from '@mcro/debug'
import { Setting } from '@mcro/models'
import { watchModel } from '@mcro/helpers'

const log = debug('syncer')
const DEFAULT_CHECK_INTERVAL = 1000 * 60 // 1 minute

export default class Syncer {
  actions: Object
  type: string
  syncers: Object
  getSyncers: (Setting) => Object
  settings: {
    checkInterval?: number
  }
  jobWatcher: any

  constructor(type, { settings = {}, actions, getSyncers }) {
    this.actions = actions
    this.type = type
    this.getSyncers = getSyncers
    this.settings = settings
  }

  async start() {
    const watch = watchModel(Setting, { type: this.type }, async setting => {
      if (setting.token) {
        watch.cancel()
        this.syncers = this.getSyncers(setting)
        console.log('got setting update', this.type)
        for (const name of Object.keys(this.syncers)) {
          this[name] = this.syncers[name]
        }
      }
    })
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
    if (action == 'all') {
      await this.runAll()
      return
    }
    if (!this.actions[action]) {
      throw new Error(`NO SYNCER FOUND ${this.type} ${action}`)
    }
    if (!this.syncers || !this.syncers[action]) {
      return
    }
    log(`run() ${this.type} ${action}`)
    await this.syncers[action].run()
    log(`run() finished -- ${this.type} ${action}`)
  }

  async runAll() {
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

  dispose() {
    if (this.jobWatcher) {
      clearInterval(this.jobWatcher)
    }
  }
}
