import * as Helpers from '../helpers'
import debug from '@mcro/debug'
import { Setting, findOrCreate } from '@mcro/models'

const log = debug('sync')
const DEFAULT_CHECK_INTERVAL = 1000 * 60 // 1 minute

export default class Syncer {
  actions: Object
  type: string
  syncers: (Setting) => Object
  settings: {
    checkInterval?: number
  }
  jobWatcher: any

  constructor(type, { settings = {}, actions, syncers }) {
    this.actions = actions
    this.type = type
    this.syncers = syncers
    this.settings = settings
  }

  start() {
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
    log(`run() ${this.type} ${action}`)
    if (!this.actions[action]) {
      throw new Error(`NO SYNCER FOUND ${action}`)
    }
    const setting = await findOrCreate(Setting, { type: name })
    if (!setting || !setting.token) {
      throw `No setting token for syncer ${name}`
    }
    await this.syncers(setting)[action].run()
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
