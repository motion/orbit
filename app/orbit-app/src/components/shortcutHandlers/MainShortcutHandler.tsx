import { ProvideStores, ShortcutStore } from '@o/kit'
import { App } from '@o/stores'
import { Direction, GlobalHotKeys, PopoverState } from '@o/ui'
import { useStore } from '@o/use-store'
import React, { memo, useMemo } from 'react'
import { AppActions } from '../../actions/appActions/AppActions'
import { useActions } from '../../hooks/useActions'
import { useStores } from '../../hooks/useStores'

// TODO these would be easier to search if they all prefixed with something

const rootShortcuts = {
  COMMAND_NEW: 'command+n',
  COMMAND_OPEN: 'command+enter',
  OPEN: ['tab', 'enter'],
  SWITCH_SPACE: 'command+k',
  COPY_LINK: 'command+shift+c',
  ESCAPE: 'esc',
  DOWN: 'down',
  UP: 'up',
  LEFT_TAB: 'command+shift+[',
  RIGHT_TAB: 'command+shift+]',
  LEFT: 'left',
  RIGHT: 'right',
  COMMAND_1: 'command+1',
  COMMAND_2: 'command+2',
  COMMAND_3: 'command+3',
  COMMAND_4: 'command+4',
  COMMAND_5: 'command+5',
  COMMAND_6: 'command+6',
  COMMAND_7: 'command+7',
  COMMAND_8: 'command+8',
  COMMAND_9: 'command+9',
}

export default memo(function MainShortcutHandler(props: {
  children?: React.ReactNode
  handlers?: any
}) {
  const { queryStore, paneManagerStore } = useStores()
  const shortcutStore = useStore(ShortcutStore)
  const Actions = useActions()

  const handlers = useMemo(() => {
    let res: any = {
      COMMAND_NEW: Actions.setupNewApp,
      COMMAND_OPEN: () => {
        console.log('tear app', Actions.tearApp)
        Actions.tearApp()
      },
      SWITCH_SPACE: () => {
        paneManagerStore.setActivePaneByType('spaces')
      },
      OPEN: () => {
        if (document.activeElement && document.activeElement.classList.contains('ui-input')) {
          // TODO this could be done in a more standard, nice way
          console.log('avoid shortcuts on sub-inputs')
          return
        }
        shortcutStore.emit('open')
      },
      COPY_LINK: async () => {
        console.log('COPY_LINK')
        require('electron').remote.clipboard.writeText('http://example.com')
        // let link
        // if (item.target === 'bit') {
        //   link = item.webLink
        // }
        // Actions.copySelectedItemLink()
        // Actions.COPY_LINK(searchStore.selectedItem)
      },
      ESCAPE: () => {
        console.log('ESCAPE')
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
      UP: () => shortcutStore.emit(Direction.up),
      DOWN: () => shortcutStore.emit(Direction.down),
      LEFT: () => shortcutStore.emit(Direction.left),
      RIGHT: () => shortcutStore.emit(Direction.right),
    }

    if (paneManagerStore) {
      res = {
        ...res,
        RIGHT_TAB: () => paneManagerStore.move(Direction.right),
        LEFT_TAB: () => paneManagerStore.move(Direction.left),
        COMMAND_1: () => paneManagerStore.setPaneByKeyableIndex(0),
        COMMAND_2: () => paneManagerStore.setPaneByKeyableIndex(1),
        COMMAND_3: () => paneManagerStore.setPaneByKeyableIndex(2),
        COMMAND_4: () => paneManagerStore.setPaneByKeyableIndex(3),
        COMMAND_5: () => paneManagerStore.setPaneByKeyableIndex(4),
        COMMAND_6: () => paneManagerStore.setPaneByKeyableIndex(5),
        COMMAND_7: () => paneManagerStore.setPaneByKeyableIndex(6),
        COMMAND_8: () => paneManagerStore.setPaneByKeyableIndex(7),
        COMMAND_9: () => paneManagerStore.setPaneByKeyableIndex(8),
      }
    }

    return {
      ...res,
      ...props.handlers,
    }
  }, [Actions, paneManagerStore, queryStore])

  return (
    <ProvideStores stores={{ shortcutStore }}>
      <GlobalHotKeys keyMap={rootShortcuts} style={hotKeyStyle} handlers={handlers}>
        {props.children}
      </GlobalHotKeys>
    </ProvideStores>
  )
})

const hotKeyStyle = {
  flex: 1,
}
