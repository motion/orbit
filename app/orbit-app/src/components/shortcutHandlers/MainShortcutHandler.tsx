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

const decorate = compose(view.attach('selectionStore', 'paneManagerStore'))
export const MainShortcutHandler = decorate(
  ({ selectionStore, paneManagerStore, children }: Props) => {
    const movePaneOrSelection = direction => () => {
      if (
        (selectionStore.activeIndex === -1 ||
          (selectionStore.activeIndex === 0 && paneManagerStore.activePane === 'search')) &&
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
      1: paneManagerStore.activePaneSetter(1 - 1),
      2: paneManagerStore.activePaneSetter(2 - 1),
      3: paneManagerStore.activePaneSetter(3 - 1),
      4: paneManagerStore.activePaneSetter(4 - 1),
      5: paneManagerStore.activePaneSetter(5 - 1),
      6: paneManagerStore.activePaneSetter(6 - 1),
      7: paneManagerStore.activePaneSetter(7 - 1),
      8: paneManagerStore.activePaneSetter(8 - 1),
      9: paneManagerStore.activePaneSetter(9 - 1),
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
