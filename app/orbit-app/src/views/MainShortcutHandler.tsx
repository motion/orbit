import { command } from '@o/kit'
import { ToggleOrbitMainCommand } from '@o/models'
import { Electron } from '@o/stores'
import { Direction, GlobalHotKeys, PopoverState, useShortcutStore } from '@o/ui'
import React, { memo, useMemo } from 'react'

import { useStores } from '../hooks/useStores'
import { useOm } from '../om/om'
import { appsCarouselStore } from '../pages/OrbitPage/OrbitAppsCarousel'
import { appsDrawerStore } from '../pages/OrbitPage/OrbitAppsDrawer'
import { orbitDockStore } from '../pages/OrbitPage/OrbitDock'

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
        // see OrbitHeaderInput instead
      },
      ESCAPE: () => {
        // close any open popovers
        if (PopoverState.state.size > 0) {
          PopoverState.closeLast()
          return
        }
        // close dock if open
        if (orbitDockStore.isOpen) {
          orbitDockStore.close()
          return
        }
        // clear input if written in
        if (queryStore.hasQuery) {
          queryStore.clearQuery()
          return
        }
        // close app drawer if open
        if (appsDrawerStore.isOpen) {
          appsDrawerStore.closeDrawer()
          return
        }
        // zoom out
        if (appsCarouselStore.zoomedIn) {
          appsCarouselStore.setZoomedOut()
          return
        }
        // go to first app
        if (appsCarouselStore.focusedIndex > 0) {
          actions.router.showHomePage({ avoidZoom: true })
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
        if (!appsDrawerStore.isOpen && appsCarouselStore.state.zoomedOut) {
          // handle moving between input/carousel
          return
        }
        shortcutStore.emit(Direction.up)
      },
      DOWN: () => {
        if (!appsDrawerStore.isOpen && appsCarouselStore.state.zoomedOut) {
          // handle moving between input/carousel
          return
        }
        shortcutStore.emit(Direction.down)
      },
      LEFT: () => {
        if (!appsDrawerStore.isOpen) {
          if (appsCarouselStore.state.zoomedOut) {
            appsCarouselStore.left()
            return
          }
        }
        shortcutStore.emit(Direction.left)
      },
      RIGHT: () => {
        if (!appsDrawerStore.isOpen) {
          if (appsCarouselStore.state.zoomedOut) {
            appsCarouselStore.right()
            return
          }
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
