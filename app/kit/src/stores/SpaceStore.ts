import { observeMany, observeOne } from '@o/bridge'
import { AppModel, SpaceModel, UserModel } from '@o/models'
import { ensure, react } from '@o/use-store'

import { appSelectAllButDataAndTimestamps } from '../hooks/useActiveApps'
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
      return observeMany(AppModel, {
        args: { where: { spaceId: space.id }, select: appSelectAllButDataAndTimestamps },
      })
    },
    {
      defaultValue: [],
    },
  )

  apps = react(
    () => [this.appsUnsorted, this.activeSpace.paneSort || []],
    ([apps, paneSort]) => sortApps(apps || [], paneSort),
    {
      defaultValue: [],
    },
  )
}
