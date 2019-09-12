import { useStoresSimple } from '@o/kit'
import { App } from '@o/stores'
import { Direction, GlobalHotKeys, Popovers, useShortcutStore } from '@o/ui'
import React, { memo, useMemo } from 'react'

import { useOm } from '../om/om'
import { appsDrawerStore } from '../om/stores'
import { appsCarouselStore } from '../pages/OrbitPage/OrbitAppsCarouselStore'
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
  const { queryStore, paneManagerStore } = useStoresSimple()
  const shortcutStore = useShortcutStore({ react: false })
  const { actions, effects } = useOm()

  console.warn('rendering main shortcut handler')

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
        if (Popovers.state.size > 0) {
          Popovers.closeLast()
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
          actions.router.closeDrawer()
          return
        }
        if (App.appRole === 'main') {
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
        }
        // close orbit itself
        // if (Electron.state.showOrbitMain) {
        //   command(ToggleOrbitMainCommand)
        // }
      },
      UP: () => {
        shortcutStore.emit(Direction.up)
      },
      DOWN: () => {
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
      BACK: () => actions.router.back(),
      FORWARD: () => actions.router.forward(),
      RIGHT_TAB: () => appsCarouselStore.right(),
      LEFT_TAB: () => appsCarouselStore.left(),
      COMMAND_1: () => appsCarouselStore.setFocused(0, true),
      COMMAND_2: () => appsCarouselStore.setFocused(1, true),
      COMMAND_3: () => appsCarouselStore.setFocused(2, true),
      COMMAND_4: () => appsCarouselStore.setFocused(3, true),
      COMMAND_5: () => appsCarouselStore.setFocused(4, true),
      COMMAND_6: () => appsCarouselStore.setFocused(5, true),
      COMMAND_7: () => appsCarouselStore.setFocused(6, true),
      COMMAND_8: () => appsCarouselStore.setFocused(7, true),
      COMMAND_9: () => appsCarouselStore.setFocused(8, true),
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
