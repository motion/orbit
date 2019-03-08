import { ShortcutStore } from '@o/kit'
import { App } from '@o/stores'
import { Direction, MergeContext, PopoverState } from '@o/ui'
import { useStore } from '@o/use-store'
import React, { memo } from 'react'
import { AppActions } from '../../actions/appActions/AppActions'
import { StoreContext } from '../../contexts'
import { useActions } from '../../hooks/useActions'
import { useStores } from '../../hooks/useStores'
import FocusableShortcutHandler from '../../views/FocusableShortcutHandler'

const rootShortcuts = {
  closeApp: 'command+q',
  closeTab: 'command+w',
  commandNew: 'command+n',
  commandOpen: 'command+enter',
  open: ['tab', 'enter'],
  switchSpaces: 'command+k',
  copyLink: 'command+shift+c',
  escape: 'esc',
  down: 'down',
  up: 'up',
  leftTab: 'command+shift+[',
  rightTab: 'command+shift+]',
  left: 'left',
  right: 'right',
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

export default memo(function MainShortcutHandler(props: {
  children?: React.ReactNode
  handlers?: any
}) {
  const { newAppStore, queryStore, paneManagerStore } = useStores()
  const shortcutStore = useStore(ShortcutStore)
  const Actions = useActions()

  let handlers: any = {
    commandNew: () => newAppStore.setShowCreateNew(true),
    commandOpen: () => {
      console.log('tear app', Actions.tearApp)
      Actions.tearApp()
    },
    switchSpaces: () => {
      paneManagerStore.setActivePaneByType('spaces')
    },
    open: () => {
      if (document.activeElement && document.activeElement.classList.contains('ui-input')) {
        // TODO this could be done in a more standard, nice way
        console.log('avoid shortcuts on sub-inputs')
        return
      }
      shortcutStore.emit('open')
    },
    copyLink: async () => {
      console.log('copyLink')
      require('electron').remote.clipboard.writeText('http://example.com')
      // let link
      // if (item.target === 'bit') {
      //   link = item.webLink
      // }
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
      if (App.peekState.appProps) {
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
    up: () => shortcutStore.emit(Direction.up),
    down: () => shortcutStore.emit(Direction.down),
    left: () => shortcutStore.emit(Direction.left),
    right: () => shortcutStore.emit(Direction.right),
  }

  if (paneManagerStore) {
    handlers = {
      ...handlers,
      rightTab: () => paneManagerStore.move(Direction.right),
      leftTab: () => paneManagerStore.move(Direction.left),
      1: () => paneManagerStore.setPaneByKeyableIndex(0),
      2: () => paneManagerStore.setPaneByKeyableIndex(1),
      3: () => paneManagerStore.setPaneByKeyableIndex(2),
      4: () => paneManagerStore.setPaneByKeyableIndex(3),
      5: () => paneManagerStore.setPaneByKeyableIndex(4),
      6: () => paneManagerStore.setPaneByKeyableIndex(5),
      7: () => paneManagerStore.setPaneByKeyableIndex(6),
      8: () => paneManagerStore.setPaneByKeyableIndex(7),
      9: () => paneManagerStore.setPaneByKeyableIndex(8),
    }
  }

  return (
    <MergeContext Context={StoreContext} value={{ shortcutStore }}>
      <FocusableShortcutHandler
        shortcuts={rootShortcuts}
        handlers={{
          ...handlers,
          ...props.handlers,
        }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {props.children}
      </FocusableShortcutHandler>
    </MergeContext>
  )
})
