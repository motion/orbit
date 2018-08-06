import { HotKeys } from 'react-hotkeys'
import { App, Electron } from '@mcro/stores'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../stores/SearchStore'
import { getPermalink } from '../helpers/getPermalink'

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
      console.log('!!!!!!!!!!!!!opening current', searchStore.selectedItem)
      // App.actions.open(searchStore.selectedItem)
    },
    copyLink: async () => {
      const permalink = await getPermalink(searchStore.selectedItem)
      App.sendMessage(Electron, Electron.messages.COPY, permalink)
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
