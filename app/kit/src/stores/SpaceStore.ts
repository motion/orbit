import { observeMany, observeOne } from '@mcro/bridge'
import { AppModel, SpaceModel, UserModel } from '@mcro/models'
import { App } from '@mcro/stores'
import { ensure, react } from '@mcro/use-store'
import { isEqual } from 'lodash'
import { getIsTorn } from '../helpers/getIsTorn'
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
}
