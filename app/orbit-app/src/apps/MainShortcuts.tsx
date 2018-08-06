import { HotKeys } from 'react-hotkeys'
import { App } from '@mcro/stores'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../stores/SearchStore'

type Props = {
  searchStore: SearchStore
  children?: React.ReactNode
}

const rootShortcuts = {
  openCurrent: 'command+enter',
  copyLink: 'command+shift+c',
}

const decorator = compose(view.attach('searchStore'))

export const MainShortcuts = decorator(({ searchStore, children }: Props) => {
  const handlers = {
    openCurrent: () => {
      App.actions.openItem(searchStore.selectedItem)
    },
    copyLink: async () => {
      App.actions.openItem(searchStore.selectedItem)
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
})
