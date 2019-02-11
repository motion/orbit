import { App, Electron } from '@mcro/stores'
import { last } from 'lodash'
import { AllStores } from '../contexts/StoreContext'

export function tearApp(stores: AllStores) {
  return () => {
    const { type, id } = stores.paneManagerStore.activePane
    const { allApps } = App.state

    console.log('Tearing away app', type)
    const previousApps = allApps.slice(allApps.length - 1)

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

    App.sendMessage(Electron, Electron.messages.TEAR_APP, {
      appType: type,
      appId: nextId,
    })

    // set App.orbitState.docked false so next orbit window is hidden on start
    // TODO clean up tearing a bit, including this settimeout
    // for now its just happening becuase i dont want to deal with having a proper system
    // for managing the torn windows so we're putting state on Electron.isTorn, here, etc
    setTimeout(() => {
      App.setOrbitState({ docked: false })
    }, 150)
  }
}
