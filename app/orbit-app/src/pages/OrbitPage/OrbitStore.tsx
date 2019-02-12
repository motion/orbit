import { ensure, react } from '@mcro/black'
import { observeOne } from '@mcro/model-bridge'
import { UserModel } from '@mcro/models'
import { App, Desktop } from '@mcro/stores'
import { useHook } from '@mcro/use-store'
import { isEqual } from 'lodash'
import { AppConfig, AppType } from '../../apps/AppTypes'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Pane } from '../../stores/PaneManagerStore'
import { OrbitHandleSelect } from '../../views/Lists/OrbitList'

export class OrbitStore {
  props: { activePane: Pane }

  stores = useHook(useStoresSafe)
  lastSelectAt = Date.now()
  nextItem = { index: -1, appConfig: null }
  isEditing = false

  // sync settings to App.state.isDark for now until we migrate
  activeUser = null
  activeUser$ = observeOne(UserModel, {}).subscribe(x => (this.activeUser = x))

  syncThemeToAppState = react(
    () => [this.activeUser && this.activeUser.settings.theme, Desktop.state.operatingSystem.theme],
    ([theme, osTheme]) => {
      ensure('active user', !!this.activeUser)
      const shouldBeDark = theme === 'dark' || (theme === 'automatic' && osTheme === 'dark')
      if (shouldBeDark) {
        App.setState({ isDark: true })
      } else {
        App.setState({ isDark: false })
      }
    },
    {
      defaultValue: Desktop.state.operatingSystem.theme,
    },
  )

  activeConfig: { [key: string]: AppConfig } = {
    search: { id: '', type: AppType.search, title: '' },
  }

  setEditing = () => {
    this.isEditing = true
  }

  handleSelectItem: OrbitHandleSelect = (index, appConfig) => {
    this.nextItem = { index, appConfig }
  }

  updateSelectedItem = react(
    () => this.nextItem,
    async ({ appConfig }, { sleep }) => {
      // if we are quickly selecting (keyboard nav) sleep it so we dont load every item as we go
      const last = this.lastSelectAt
      this.lastSelectAt = Date.now()
      if (Date.now() - last < 80) {
        await sleep(50)
      }
      ensure('app config', !!appConfig)
      const paneType = this.props.activePane.type
      if (!isEqual(this.activeConfig[paneType], appConfig)) {
        this.activeConfig = {
          ...this.activeConfig,
          [paneType]: appConfig,
        }
      }
    },
  )
}
