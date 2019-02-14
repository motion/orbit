import { ensure, react } from '@mcro/black'
import { AppModel, SourceModel, Space, SpaceModel, UserModel } from '@mcro/models'
import { isEqual } from 'lodash'
import { observeMany, observeOne } from '../mediator'
import { getPanes } from './getPanes'
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
    return (this.user && this.spaces[this.user.activeSpace]) || { id: -1 }
  }

  apps = react(
    () => this.activeSpace,
    space => {
      ensure('space', !!space)
      return observeMany(AppModel, { args: { where: { spaceId: space.id } } })
    },
    {
      defaultValue: [],
    },
  )

  managePaneSort = react(
    () => this.apps,
    apps => {
      if (!apps) return
      const { paneManagerStore } = this.props
      console.log('paneManagerStore', paneManagerStore, this.props)
      const { panes, paneIndex } = getPanes(paneManagerStore, this.apps)
      if (!isEqual(panes, paneManagerStore.panes)) {
        console.log('updating panes', panes)
        paneManagerStore.setPanes(panes)
      }
      paneManagerStore.setPaneIndex(paneIndex)
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
