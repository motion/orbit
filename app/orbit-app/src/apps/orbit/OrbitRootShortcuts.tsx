import { HotKeys } from 'react-hotkeys'
import { App } from '@mcro/stores'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../../stores/SearchStore'
import { clipboard } from 'electron'
import { getPermalink } from '../../helpers/getPermalink'

type Props = {
  searchStore: SearchStore
  children?: React.ReactNode
}

const rootShortcuts = {
  openCurrent: 'command+enter',
  copyLink: 'command+shift+c',
}

const decorator = compose(view.attach('searchStore'))

export const OrbitRootShortcuts = decorator(
  ({ searchStore, children }: Props) => {
    const handlers = {
      openCurrent: () => {
        console.log('opening current', searchStore.selectedItem)
        App.actions.open(searchStore.selectedItem)
      },
      copyLink: async () => {
        const permalink = await getPermalink(searchStore.selectedItem)
        clipboard.writeText(permalink)
      },
    }

    return (
      <HotKeys keyMap={rootShortcuts} handlers={handlers}>
        {children}
      </HotKeys>
    )
  },
)
