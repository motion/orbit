import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SelectionStore } from '../../apps/orbit/orbitDocked/SelectionStore'
import { Actions } from '../../actions/Actions'
import { App } from '@mcro/stores'
import { FocusableShortcutHandler } from '../../views/FocusableShortcutHandler'

type Props = {
  selectionStore: SelectionStore
  children?: React.ReactNode
}

const rootShortcuts = {
  openCurrent: 'command+enter',
  copyLink: 'command+shift+c',
  escape: 'esc',
}

const decorator = compose(view.attach('selectionStore'))

export const MainShortcutHandler = decorator(
  ({ selectionStore, children }: Props) => {
    const handlers = {
      openCurrent: () => {
        Actions.openItem(selectionStore.selectedItem)
      },
      copyLink: async () => {
        Actions.copyLink(selectionStore.selectedItem)
      },
      escape: () => {
        if (App.peekState.appConfig) {
          Actions.clearPeek()
          return
        }
        if (App.state.orbitState.docked) {
          Actions.closeOrbit()
          return
        }
      },
    }

    return (
      <FocusableShortcutHandler shortcuts={rootShortcuts} handlers={handlers}>
        {children}
      </FocusableShortcutHandler>
    )
  },
)
