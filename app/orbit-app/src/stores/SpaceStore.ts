import { ensure, react } from '@mcro/black'
import { AppModel, SourceModel, Space, SpaceModel, UserModel } from '@mcro/models'
import { isEqual, once } from 'lodash'
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

  apps = react(() => this.appsUnsorted, apps => sortApps(apps, this.activeSpace.paneSort || []), {
    defaultValue: [],
  })

  setInitialPaneIndex = once(() => {
    this.props.paneManagerStore.setPaneIndex(defaultPanes.length)
  })

  managePaneSort = react(
    () => this.apps,
    apps => {
      ensure('apps', !!apps)
      const { paneManagerStore } = this.props
      const { panes, paneIndex } = getPanes(paneManagerStore, this.apps)
      paneManagerStore.setPaneIndex(paneIndex)
      if (!isEqual(panes, paneManagerStore.panes)) {
        paneManagerStore.setPanes(panes)
        this.setInitialPaneIndex()
      }
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
