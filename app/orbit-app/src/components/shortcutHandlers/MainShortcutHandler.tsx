import * as React from 'react'
import { view, compose } from '@mcro/black'
import { Actions } from '../../actions/Actions'
import { App } from '@mcro/stores'
import { FocusableShortcutHandler } from '../../views/FocusableShortcutHandler'
import { PopoverState } from '@mcro/ui'
import { SelectionStore, Direction } from '../../pages/OrbitPage/orbitDocked/SelectionStore'
import { PaneManagerStore } from '../../pages/OrbitPage/PaneManagerStore'

type Props = {
  paneManagerStore?: PaneManagerStore
  selectionStore: SelectionStore
  children?: React.ReactNode
}

const rootShortcuts = {
  switchSpaces: 'command+k',
  openCurrent: 'enter',
  copyLink: 'command+shift+c',
  escape: 'esc',
  down: 'down',
  up: 'up',
  left: 'left',
  right: 'right',
}

const decorate = compose(view.attach('selectionStore', 'paneManagerStore'))
export const MainShortcutHandler = decorate(
  ({ selectionStore, paneManagerStore, children }: Props) => {
    const movePaneOrSelection = direction => () => {
      if (
        selectionStore.activeIndex === -1 &&
        (direction === Direction.left || direction === Direction.right)
      ) {
        paneManagerStore.move(direction)
      } else {
        selectionStore.move(direction)
      }
    }

    const handlers = {
      switchSpaces: () => {
        Actions.showSpaceSwitcher()
      },
      openCurrent: () => {
        console.log('openCurrent')
        Actions.openItem(selectionStore.selectedItem)
      },
      copyLink: async () => {
        console.log('copyLink')
        Actions.copyLink(selectionStore.selectedItem)
      },
      escape: () => {
        console.log('escape')
        if (PopoverState.openPopovers.size > 0) {
          PopoverState.closeLast()
          return
        }
        // clear peek first
        if (App.peekState.appConfig) {
          return Actions.clearPeek()
        }
        // then orbit query
        if (App.state.query) {
          return Actions.clearSearch()
        }
        // then orbit itself
        if (App.state.orbitState.docked) {
          return Actions.closeOrbit()
        }
      },
      up: movePaneOrSelection(Direction.up),
      down: movePaneOrSelection(Direction.down),
      left: movePaneOrSelection(Direction.left),
      right: movePaneOrSelection(Direction.right),
    }

    return (
      <FocusableShortcutHandler
        shortcuts={rootShortcuts}
        handlers={handlers}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {children}
      </FocusableShortcutHandler>
    )
  },
)
