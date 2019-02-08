import { getGlobalConfig } from '@mcro/config'
import { SettingEntity, UserEntity } from '@mcro/models'
import { DesktopActions } from '@mcro/stores'
import { pathExists, writeJSON } from 'fs-extra'
import { debounce } from 'lodash'
import { join } from 'path'
import { getRepository } from 'typeorm'
import { ensureHomeDir } from './OrbitDataManager/helpers'

// this manages the user configuration and data
// we are using git to start
// but we can dump into JSON to make it easy to migrate however
export const dataDir = getGlobalConfig().paths.userData
export const dataPrivateDir = join(dataDir, '.orbit')
export const dataSettingsDir = join(dataPrivateDir, 'settings')
export const dataSpacesDir = join(dataDir, 'spaces')

export class OrbitDataManager {
  subscriptions = new Set<ZenObservable.Subscription>()

  // can run multiple times if it fails
  async start() {
    // dispose previous before running
    this.dispose()

    // setup homedir
    await ensureHomeDir(dataDir, [dataSettingsDir, dataSpacesDir])

    // validate homedir
    const subDirsExist = await Promise.all([pathExists(dataSettingsDir), pathExists(dataSpacesDir)])
    if (!subDirsExist) {
      DesktopActions.error.setError({
        title: 'Error checking data directories',
        message: `You have a proper data directory, but are missing a sub-directory. Check that ${dataSettingsDir} and ${dataSpacesDir} exist.`,
        type: 'error',
      })
      return
    }

    // start watching and persisting changes
    this.observeDatabase()
  }

  dispose() {
    for (const subscription of [...this.subscriptions]) {
      subscription.unsubscribe()
    }
  }

  async observeDatabase() {
    this.observeUserSettings()
    this.observeSpaces()
  }

  observeUserSettings() {
    const state = {
      settings: null,
      user: null,
    }

    const persist = debounce(() => writeJSON(join(dataSettingsDir, 'settings.json'), state), 300)

    addObserver(this.subscriptions, SettingEntity, values => {
      state.settings = values
      persist()
    })

    addObserver(this.subscriptions, UserEntity, value => {
      state.user = value
      persist()
    })
  }

  observeSpaces() {}
}

function addObserver(subs: Set<any>, entity: Function, cb: any) {
  const sub = getRepository(entity)
    .observe({})
    .subscribe(cb)
  subs.add(sub)
}
