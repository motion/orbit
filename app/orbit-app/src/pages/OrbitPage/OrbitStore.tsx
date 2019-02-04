import { ensure, react } from '@mcro/black'
import { observeOne } from '@mcro/model-bridge'
import { AppConfig, AppType, UserModel } from '@mcro/models'
import { App, Desktop, Electron } from '@mcro/stores'
import { useHook } from '@mcro/use-store'
import { isEqual, memoize } from 'lodash'
import { AppStore } from '../../apps/AppStore'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { OrbitHandleSelect } from '../../views/Lists/OrbitList'

export class OrbitStore {
  isTorn = false
  stores = useHook(useStoresSafe)
  lastSelectAt = Date.now()
  nextItem = { index: -1, appConfig: null }

  get activePane() {
    return this.stores.paneManagerStore.activePane
  }

  // sync settings to App.state.isDark for now until we migrate
  activeUser = null
  activeUser$ = observeOne(UserModel, {}).subscribe(x => (this.activeUser = x))

  syncThemeToAppState = react(
    () => [this.activeUser && this.activeUser.settings.theme, Desktop.state.operatingSystem.theme],
    ([theme, osTheme]) => {
      if (theme === 'dark' || (theme === 'automatic' && osTheme === 'dark')) {
        App.setState({ isDark: true })
      } else {
        App.setState({ isDark: false })
      }
    },
  )

  appStores: { [key: string]: AppStore<any> } = {}
  activeConfig: { [key: string]: AppConfig } = {
    search: { id: '', type: AppType.search, title: '' },
  }

  setTorn = () => {
    this.isTorn = true
    console.log('Tearing away app', this.activePane.type)
    App.setState({ appCount: App.state.appCount + 1 })
    App.sendMessage(Electron, Electron.messages.TEAR, this.activePane.type)
    // set App.orbitState.docked false so next orbit window is hidden on start
    // TODO clean up tearing a bit, including this settimeout
    // for now its just happening becuase i dont want to deal with having a proper system
    // for managing the torn windows so we're putting state on Electron.isTorn, here, etc
    setTimeout(() => {
      App.setOrbitState({ docked: false })
    }, 40)
  }

  handleSelectItem: OrbitHandleSelect = (index, appConfig) => {
    this.nextItem = { index, appConfig }
  }

  updateSelectedItem = react(
    () => this.nextItem,
    async ({ appConfig }, { sleep }) => {
      const last = this.lastSelectAt
      this.lastSelectAt = Date.now()
      // if we are quickly selecting (keyboard nav) sleep it so we dont load every item as we go
      if (Date.now() - last < 50) {
        await sleep(50)
      }
      ensure('app config', !!appConfig)
      const paneType = this.activePane.type
      if (!isEqual(this.activeConfig[paneType], appConfig)) {
        this.activeConfig = {
          ...this.activeConfig,
          [paneType]: appConfig,
        }
      }
    },
  )

  setAppStore = memoize((id: string) => (store: AppStore<any>) => {
    if (this.appStores[id] !== store) {
      this.appStores = {
        ...this.appStores,
        [id]: store,
      }
    }
  })
}
