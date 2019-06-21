import { AppEntity, Space, SpaceEntity, UserEntity } from '@o/models'
import { DesktopActions } from '@o/stores'
import { ensureDir, pathExists, writeJSON } from 'fs-extra'
import { debounce } from 'lodash'
import { homedir } from 'os'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { ensureHomeDir } from './OrbitDataManager/helpers'

// this manages the user configuration and data
// we are using git to start
// but we can dump into JSON to make it easy to migrate however

export const dataDir = join(homedir(), '.orbit')
export const dataPrivateDir = join(dataDir, '.private')
export const dataSettingsDir = join(dataPrivateDir, 'settings')
export const dataSpacesDir = join(dataDir, 'spaces')

export class OrbitDataManager {
  subscriptions = new Set<ZenObservable.Subscription>()

  // can run multiple times if it fails
  async start() {
    // dispose previous before running
    this.dispose()

    try {
      // setup homedir
      await ensureHomeDir(dataDir, dataPrivateDir, [dataSettingsDir, dataSpacesDir])

      // validate homedir
      const subDirsExist = await Promise.all([
        pathExists(dataSettingsDir),
        pathExists(dataSpacesDir),
      ])
      if (!subDirsExist) {
        DesktopActions.error.setError({
          title: 'Error checking data directories',
          message: `You have a proper data directory, but are missing a sub-directory. Check that ${dataSettingsDir} and ${dataSpacesDir} exist.`,
          type: 'error',
        })
        return
      }
    } catch (err) {
      console.log('error in orbitdatamanager', err)
    }

    // start watching and persisting changes
    this.observeUserSettings()
    this.observeSpaces()
  }

  dispose() {
    for (const subscription of [...this.subscriptions]) {
      subscription.unsubscribe()
    }
  }

  observeUserSettings() {
    const state = {
      settings: null,
      user: null,
    }

    const persist = debounce(() => writeJSON(join(dataSettingsDir, 'settings.json'), state), 300)

    addObserveMany(this.subscriptions, UserEntity, {}, value => {
      state.user = value
      persist()
    })
  }

  observeSpaces() {
    let disposers = new Set<Function>()

    addObserveMany(this.subscriptions, SpaceEntity, {}, spaces => {
      // unsubscribe last
      ;[...disposers].forEach(o => o())

      // watch spaces
      for (const space of spaces) {
        const subs = this.observeSpace(space)
        disposers.add(() => [...subs].forEach(sub => sub.unsubscribe()))
      }
    })
  }

  observeSpace(space: Space) {
    // console.log('observing space', space)
    const subscribers = new Set<ZenObservable.Subscription>()

    const state = {
      space: null,
      apps: null,
      sources: null,
    }

    const persist = debounce(async () => {
      try {
        await ensureDir(join(dataSpacesDir, space.name))
      } catch {}
      writeJSON(join(dataSpacesDir, space.name, 'orbit-data.json'), state, {
        spaces: 2,
      })
    }, 300)

    addObserveOne(this.subscriptions, SpaceEntity, { where: { id: space.id } }, space => {
      state.space = space
      persist()
    })

    addObserveMany(this.subscriptions, AppEntity, { where: { spaceId: space.id } }, apps => {
      state.apps = apps
      persist()
    })

    return subscribers
  }
}

// TODO type

export function addObserveMany(subs: Set<any>, entity: any, query: any, cb: any) {
  const sub = getRepository(entity)
    .observe(query)
    .subscribe(cb)
  subs.add(sub)
}

export function addObserveOne(subs: Set<any>, entity: any, query: any, cb: any) {
  const sub = getRepository(entity)
    .observeOne(query)
    .subscribe(cb)
  subs.add(sub)
}
