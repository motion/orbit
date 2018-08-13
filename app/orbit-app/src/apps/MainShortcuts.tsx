import { HotKeys } from 'react-hotkeys'
import { App } from '@mcro/stores'
import { view, compose } from '@mcro/black'
import { SelectionStore } from '../stores/SelectionStore'

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
        App.actions.openItem(selectionStore.selectedItem)
      },
      copyLink: async () => {
        App.actions.copyLink(selectionStore.selectedItem)
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
