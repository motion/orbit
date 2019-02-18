import { ensure, react } from '@mcro/black'
import { AppModel, SourceModel, Space, SpaceModel, UserModel } from '@mcro/models'
import { App } from '@mcro/stores'
import { isEqual, once } from 'lodash'
import { getIsTorn } from '../helpers/getAppHelpers'
import { sortApps } from '../hooks/useActiveAppsSorted'
import { observeMany, observeOne } from '../mediator'
import { defaultPanes, getPanes } from './getPanes'
import { PaneManagerStore } from './PaneManagerStore'
import { getAppFromSource } from './SourcesStore'

export class SpaceStore {
  props: { paneManagerStore: PaneManagerStore }
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
      if (!this.hasStarted && !getIsTorn()) {
        await sleep(10)
        console.log('show orbit first time after theme is set')
        this.hasStarted = true
        App.setOrbitState({ docked: true })
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
        log('updating panes', panes)
        paneManagerStore.setPanes(panes)
      }
      paneManagerStore.setPaneIndex(paneIndex)
      this.setInitialPaneIndex()
    },
  )

  spaceSources(space: Space) {
    return this.sources
      .filter(source => {
        return source.spaces.find(sourceSpace => sourceSpace.id === space.id)
      })
      .map(getAppFromSource) // todo: this is temporary to make things working, Nate should change that
  }

  activeSources() {
    return this.sources
      .filter(source => {
        return source.spaces.find(sourceSpace => sourceSpace.id === this.activeSpace.id)
      })
      .map(getAppFromSource) // todo: this is temporary to make things working, Nate should change that
  }
}
