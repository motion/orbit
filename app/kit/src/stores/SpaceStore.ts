import { observeMany, observeOne } from '@mcro/bridge'
import { AppModel, SpaceModel, UserModel } from '@mcro/models'
import { ensure, react } from '@mcro/use-store'
import { sortApps } from '../hooks/useActiveAppsSorted'
import { PaneManagerStore } from './PaneManagerStore'

export class SpaceStore {
  props: {
    paneManagerStore: PaneManagerStore
  }

  spaces = react(() => observeMany(SpaceModel, { args: {} }), {
    defaultValue: [],
  })

  user = react(() => observeOne(UserModel, {}))

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
}
