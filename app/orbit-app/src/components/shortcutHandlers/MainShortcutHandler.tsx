import * as React from 'react'
import { view, compose } from '@mcro/black'
import { Actions } from '../../actions/Actions'
import { App } from '@mcro/stores'
import { FocusableShortcutHandler } from '../../views/FocusableShortcutHandler'
import { PopoverState } from '@mcro/ui'
import { SelectionStore, Direction } from '../../pages/OrbitPage/orbitDocked/SelectionStore'

type Props = {
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

const decorator = compose(view.attach('selectionStore'))

export const MainShortcutHandler = decorator(({ selectionStore, children }: Props) => {
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
    up: () => selectionStore.move(Direction.up),
    down: () => selectionStore.move(Direction.down),
    left: () => selectionStore.move(Direction.left),
    right: () => selectionStore.move(Direction.right),
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
})
