import { observeMany, observeOne } from '@mcro/bridge'
import { AppModel, SourceModel, Space, SpaceModel, UserModel } from '@mcro/models'
import { App } from '@mcro/stores'
import { ensure, react } from '@mcro/use-store'
import { isEqual, once } from 'lodash'
import { getIsTorn } from '../helpers/getIsTorn'
import { sortApps } from '../hooks/useActiveAppsSorted'
import { PaneManagerStore } from './PaneManagerStore'
import { defaultPanes, getPanes } from './PaneManagerStoreHelpers'

export class SpaceStore {
  props: {
    paneManagerStore: PaneManagerStore
  }

  spaces = react(() => 1, () => observeMany(SpaceModel, { args: {} }), {
    defaultValue: [],
  })

  sources = react(
    () => 1,
    () =>
      observeMany(SourceModel, {
        args: {
          relations: ['spaces'],
        },
      }),
    {
      defaultValue: [],
    },
  )

  user = react(() => 1, () => observeOne(UserModel, {}))

  hasStarted = false

  syncUserSettings = react(
    () => this.user,
    async (user, { sleep }) => {
      ensure('has user', !!user)
      if (!isEqual(user.settings, App.state.userSettings)) {
        App.setState({ userSettings: user.settings })
      }
      if (!this.hasStarted) {
        await sleep(10)
        this.hasStarted = true
        if (!getIsTorn()) {
          App.setOrbitState({ docked: true })
        }
      }
    },
  )

  get activeSpace() {
    if (this.user && this.spaces.length) {
      return this.spaces.find(x => x.id === this.user.activeSpace)
    }
    return { id: -1 }
  }

  appsUnsorted = react(
    () => this.activeSpace,
    space => {
      ensure('space', !!space)
      return observeMany(AppModel, { args: { where: { spaceId: space.id } } })
    },
    {
      defaultValue: [],
    },
  )

  apps = react(
    () => [this.appsUnsorted, this.activeSpace.paneSort || []],
    ([apps, paneSort]) => sortApps(apps, paneSort),
    {
      defaultValue: [],
    },
  )

  setInitialPaneIndex = once(() => {
    if (getIsTorn()) return
    this.props.paneManagerStore.setPaneIndex(defaultPanes.length)
  })

  managePaneSort = react(
    () => this.apps,
    apps => {
      ensure('apps', !!apps.length)
      const { paneManagerStore } = this.props
      const { panes, paneIndex } = getPanes(paneManagerStore, apps)
      if (!isEqual(panes, paneManagerStore.panes)) {
        paneManagerStore.setPanes(panes)
      }
      paneManagerStore.setPaneIndex(paneIndex)
      this.setInitialPaneIndex()
    },
  )

  spaceSources(space: Space) {
    console.warn('nate: i changed this type in refactor to be simpler, needs fix')
    return this.sources.filter(source => {
      return source.spaces.find(sourceSpace => sourceSpace.id === space.id)
    })
  }

  activeSources() {
    console.warn('nate: i changed this type in refactor to be simpler, needs fix')
    return this.sources.filter(source => {
      return source.spaces.find(sourceSpace => sourceSpace.id === this.activeSpace.id)
    })
  }
}
