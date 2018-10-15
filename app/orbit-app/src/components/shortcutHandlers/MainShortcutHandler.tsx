import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SelectionStore } from '../../apps/orbit/orbitDocked/SelectionStore'
import { Actions } from '../../actions/Actions'
import { App } from '@mcro/stores'
import { FocusableShortcutHandler } from '../../views/FocusableShortcutHandler'
import { PopoverState } from '@mcro/ui'

type Props = {
  selectionStore: SelectionStore
  children?: React.ReactNode
}

const rootShortcuts = {
  switchSpaces: 'command+k',
  openCurrent: 'enter',
  copyLink: 'command+shift+c',
  // esc
  escape: 'esc',
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
  }

  return (
    <FocusableShortcutHandler shortcuts={rootShortcuts} handlers={handlers}>
      {children}
    </FocusableShortcutHandler>
  )
})
