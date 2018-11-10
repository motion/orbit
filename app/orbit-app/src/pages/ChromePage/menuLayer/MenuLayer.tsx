import * as React from 'react'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { useStore } from '@mcro/use-store'
import { SelectionStore } from '../../../stores/SelectionStore'
import { StoreContext } from '../../../contexts'
import { setTrayFocused } from './helpers'
import { App } from '@mcro/stores'
import { react, ensure } from '@mcro/black'
import { AppActions } from '../../../actions/AppActions'
import { AppProps } from '../../../apps/AppProps'
import { MenuApp } from './MenuApp'
import { AppType } from '@mcro/models'

export type MenuAppProps = AppProps & { menusStore: MenusStore; id: number }

export class MenusStore {
  get menuOpenID() {
    if (!App.openMenu) {
      return false
    }
    return App.openMenu.id
  }

  lastOpenMenu = react(
    () => this.menuOpenID,
    (val, { state }) => {
      if (!state.hasResolvedOnce) {
        // for now just hardcoding to start at #2 app
        return 2
      }
      ensure('is number', typeof val === 'number')
      return val
    },
  )

  get anyMenuOpen() {
    return this.menuOpenID !== false
  }

  closePeekOnChangeMenu = react(
    () => typeof this.menuOpenID === 'number',
    isChanging => {
      ensure('isChanging', isChanging)
      AppActions.clearPeek()
    },
  )

  showMenusBeforeOpen = react(
    () => this.anyMenuOpen,
    open => {
      ensure('open', open)
      window['electronRequire']('electron').remote.app.show()
    },
  )

  handleAppViewFocus = react(
    () => App.showingPeek,
    showingPeek => {
      ensure('showingPeek', showingPeek)
      setTrayFocused(true)
    },
  )
}

export function MenuLayer() {
  const { sourcesStore, settingStore } = React.useContext(StoreContext)
  const queryStore = useStore(QueryStore, { sourcesStore }, { debug: true })
  const selectionStore = useStore(SelectionStore, { queryStore }, { debug: true })
  const menusStore = useStore(MenusStore, { debug: true })
  const storeProps = {
    settingStore,
    sourcesStore,
    queryStore,
    selectionStore,
    menusStore,
  }
  log('!!! render MenuLayer')
  return (
    <StoreContext.Provider value={storeProps}>
      {(['people', 'topics', 'lists'] as AppType[]).map((app, index) => (
        <MenuApp key={app} id={index} view="index" title={app} type={app} menusStore={menusStore} />
      ))}
    </StoreContext.Provider>
  )
}
