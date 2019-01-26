import { App } from '@mcro/stores'
import { PopoverState } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { StoreContext } from '../../contexts'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Direction } from '../../stores/SelectionStore'
import { ShortcutStore } from '../../stores/ShortcutStore'
import FocusableShortcutHandler from '../../views/FocusableShortcutHandler'
import { MergeContext } from '../../views/MergeContext'

const rootShortcuts = {
  commandOpen: 'command+enter',
  open: ['tab', 'enter'],
  switchSpaces: 'command+k',
  copyLink: 'command+shift+c',
  escape: 'esc',
  down: 'down',
  up: 'up',
  left: ['left', 'command+shift+['],
  right: ['right', 'command+shift+]'],
  1: 'command+1',
  2: 'command+2',
  3: 'command+3',
  4: 'command+4',
  5: 'command+5',
  6: 'command+6',
  7: 'command+7',
  8: 'command+8',
  9: 'command+9',
}

export default observer(function MainShortcutHandler({ children }: { children?: React.ReactNode }) {
  const { orbitStore, queryStore, paneManagerStore } = useStoresSafe()
  const shortcutStore = useStore(ShortcutStore)

  const movePaneOrSelection = (direction: Direction) => () => {
    const leftOrRight = direction === Direction.left || direction === Direction.right
    if (leftOrRight) {
      if (paneManagerStore) {
        paneManagerStore.move(direction)
      }
    } else {
      shortcutStore.emit(direction)
    }
  }

  let handlers: any = {
    commandOpen: () => {
      orbitStore.setTorn()
    },
    switchSpaces: () => {
      AppActions.showSpaceSwitcher()
    },
    open: () => {
      shortcutStore.emit('open')
    },
    copyLink: async () => {
      console.log('copyLink')
      // Actions.copySelectedItemLink()
      // Actions.copyLink(searchStore.selectedItem)
    },
    escape: () => {
      console.log('escape')
      if (PopoverState.openPopovers.size > 0) {
        PopoverState.closeLast()
        return
      }
      // clear peek first
      if (App.peekState.appConfig) {
        return AppActions.clearPeek()
      }
      // then orbit query
      if (queryStore) {
        return queryStore.setQuery('')
      }
      // then orbit itself
      if (App.state.orbitState.docked) {
        return AppActions.setOrbitDocked(false)
      }
    },
    up: movePaneOrSelection(Direction.up),
    down: movePaneOrSelection(Direction.down),
    left: movePaneOrSelection(Direction.left),
    right: movePaneOrSelection(Direction.right),
  }

  if (paneManagerStore) {
    handlers = {
      ...handlers,
      1: paneManagerStore.activePaneIndexSetter(1 - 1),
      2: paneManagerStore.activePaneIndexSetter(2 - 1),
      3: paneManagerStore.activePaneIndexSetter(3 - 1),
      4: paneManagerStore.activePaneIndexSetter(4 - 1),
      5: paneManagerStore.activePaneIndexSetter(5 - 1),
      6: paneManagerStore.activePaneIndexSetter(6 - 1),
      7: paneManagerStore.activePaneIndexSetter(7 - 1),
      8: paneManagerStore.activePaneIndexSetter(8 - 1),
      9: paneManagerStore.activePaneIndexSetter(9 - 1),
    }
  }

  return (
    <MergeContext Context={StoreContext} value={{ shortcutStore }}>
      <FocusableShortcutHandler
        shortcuts={rootShortcuts}
        handlers={handlers}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {children}
      </FocusableShortcutHandler>
    </MergeContext>
  )
})
