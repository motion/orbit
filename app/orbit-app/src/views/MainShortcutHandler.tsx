import { command } from '@o/kit'
import { ToggleOrbitMainCommand } from '@o/models'
import { Electron } from '@o/stores'
import { Direction, GlobalHotKeys, PopoverState, useShortcutStore } from '@o/ui'
import React, { memo, useMemo } from 'react'

import { useStores } from '../hooks/useStores'
import { useOm } from '../om/om'
import { appsCarousel } from '../pages/OrbitPage/OrbitAppsCarousel'
import { appsDrawerStore } from '../pages/OrbitPage/OrbitAppsDrawer'

// TODO these would be easier to search if they all prefixed with something

const rootShortcuts = {
  COMMAND_NEW: 'command+n',
  COMMAND_OPEN: 'command+enter',
  OPEN: ['tab', 'enter'],
  SWITCH_SPACE: 'command+k',
  COPY_LINK: 'command+shift+c',
  ESCAPE: 'esc',
  ENTER: 'enter',
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  BACK: 'command+[',
  FORWARD: 'command+[',
  LEFT_TAB: 'command+shift+[',
  RIGHT_TAB: 'command+shift+]',
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
  const shortcutStore = useShortcutStore()
  const { actions, effects } = useOm()

  const handlers = useMemo(() => {
    let res: any = {
      COMMAND_NEW: actions.router.showSetupAppPage,
      COMMAND_OPEN: effects.openCurrentApp,
      SWITCH_SPACE: () => actions.router.showAppPage({ id: 'spaces' }),
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
      },
      ENTER: () => {
        console.log('why doesnt this run in input?')
      },
      ESCAPE: () => {
        // close any open popovers
        if (PopoverState.openPopovers.size > 0) {
          PopoverState.closeLast()
          return
        }
        // close app drawer if open
        if (appsDrawerStore.isOpen) {
          appsDrawerStore.closeDrawer()
          return
        }
        // zoom out
        if (appsCarousel.state.zoomedOut === false) {
          appsCarousel.setZoomedOut()
          return
        }
        // go to first app
        if (appsCarousel.focusedAppIndex > 0) {
          appsCarousel.setFocusedAppIndex(0, true)
          return
        }
        // clear orbit query
        if (queryStore) {
          return queryStore.setQuery('')
        }
        // close orbit itself
        if (Electron.state.showOrbitMain) {
          command(ToggleOrbitMainCommand)
        }
      },
      UP: () => {
        if (appsCarousel.state.zoomedOut) {
          // handle moving between input/carousel
          return
        }
        shortcutStore.emit(Direction.up)
      },
      DOWN: () => {
        if (appsCarousel.state.zoomedOut) {
          // handle moving between input/carousel
          return
        }
        shortcutStore.emit(Direction.down)
      },
      LEFT: () => {
        if (appsCarousel.state.zoomedOut) {
          appsCarousel.left()
          return
        }
        shortcutStore.emit(Direction.left)
      },
      RIGHT: () => {
        if (appsCarousel.state.zoomedOut) {
          appsCarousel.right()
          return
        }
        shortcutStore.emit(Direction.right)
      },
    }

    if (paneManagerStore) {
      res = {
        ...res,
        BACK: () => actions.router.back(),
        FORWARD: () => actions.router.forward(),
        RIGHT_TAB: () => paneManagerStore.move(Direction.right),
        LEFT_TAB: () => paneManagerStore.move(Direction.left),
        COMMAND_1: () => paneManagerStore.setNextPaneKeyableIndex(0),
        COMMAND_2: () => paneManagerStore.setNextPaneKeyableIndex(1),
        COMMAND_3: () => paneManagerStore.setNextPaneKeyableIndex(2),
        COMMAND_4: () => paneManagerStore.setNextPaneKeyableIndex(3),
        COMMAND_5: () => paneManagerStore.setNextPaneKeyableIndex(4),
        COMMAND_6: () => paneManagerStore.setNextPaneKeyableIndex(5),
        COMMAND_7: () => paneManagerStore.setNextPaneKeyableIndex(6),
        COMMAND_8: () => paneManagerStore.setNextPaneKeyableIndex(7),
        COMMAND_9: () => paneManagerStore.setNextPaneKeyableIndex(8),
      }
    }

    return {
      ...res,
      ...props.handlers,
    }
  }, [paneManagerStore, queryStore])

  return (
    <GlobalHotKeys keyMap={rootShortcuts} style={hotKeyStyle} handlers={handlers}>
      {props.children}
    </GlobalHotKeys>
  )
})

const hotKeyStyle = {
  flex: 1,
}
