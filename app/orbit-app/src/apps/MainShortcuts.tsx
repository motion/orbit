import * as React from 'react'
import { HotKeys } from 'react-hotkeys'
import { view, compose } from '@mcro/black'
import { SelectionStore } from '../stores/SelectionStore'
import { Actions } from '../actions/Actions'

type Props = {
  selectionStore: SelectionStore
  children?: React.ReactNode
}

const rootShortcuts = {
  openCurrent: 'command+enter',
  copyLink: 'command+shift+c',
}

const decorator = compose(view.attach('selectionStore'))

export const MainShortcuts = decorator(
  ({ selectionStore, children }: Props) => {
    const handlers = {
      openCurrent: () => {
        Actions.openItem(selectionStore.selectedItem)
      },
      copyLink: async () => {
        Actions.copyLink(selectionStore.selectedItem)
      },
    }

    return (
      <HotKeys
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        focused
        keyMap={rootShortcuts}
        handlers={handlers}
      >
        {children}
      </HotKeys>
    )
  },
)
