import { command } from '@o/bridge'
import { TearAppCommand } from '@o/models'
import { App } from '@o/stores'
import { last } from 'lodash'

import { paneManagerStore } from '../stores'

export async function openCurrentApp() {
  const { type, id } = paneManagerStore.activePane
  const { allApps } = App.state

  console.log('Tearing away app', type)
  const previousApps = allApps.slice(0, allApps.length - 1)

  // update current app to persist the type
  const currentApp = {
    ...last(allApps),
    appId: id,
    type,
  }

  const nextId = allApps.length

  App.setState({
    allApps: [
      ...previousApps,
      currentApp,
      {
        type: 'root',
        id: nextId,
      },
    ],
  })

  await command(TearAppCommand, {
    appType: type,
    appId: nextId,
  })

  // set App.state.showOrbitMain false so next orbit window is hidden on start
  // TODO clean up tearing a bit, including this settimeout
  // for now its just happening becuase i dont want to deal with having a proper system
  // for managing the torn windows so we're putting state on Electron.isTorn, here, etc
  setTimeout(() => {
    App.setState({ showOrbitMain: false })
  }, 100)
}
