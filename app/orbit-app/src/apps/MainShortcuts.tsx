import { HotKeys } from 'react-hotkeys'
import { App, Electron } from '@mcro/stores'
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
      const { selectedItem } = searchStore
      if (!selectedItem) {
        console.log('nothing selected')
        return
      }
      if (selectedItem.target === 'person') {
        App.actions.open('')
        return
      }
      if (selectedItem.target === 'bit') {
        App.actions.open(selectedItem.desktopLink || selectedItem.webLink)
        return
      }
    },
    copyLink: async () => {
      const { selectedItem } = searchStore
      let link
      if (selectedItem.target === 'bit') {
        link = selectedItem.webLink
      }
      App.sendMessage(Electron, Electron.messages.COPY, link)
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
