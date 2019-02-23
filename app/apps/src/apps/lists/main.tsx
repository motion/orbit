import { save } from '@mcro/bridge'
import { App, AppDefinition, AppProps } from '@mcro/kit'
import { AppBit, AppModel, Bit } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import React from 'react'
import { ListsAppIndex } from './ListsAppIndex'
import { ListsAppMain } from './ListsAppMain'
import { ListAppStatusBar } from './ListsAppStatusBar'
import { ListStore } from './ListStore'
import { ListsAppBit } from './types'

function ListsApp(props: AppProps) {
  const listStore = useStore(ListStore, props)
  return (
    <App
      provideStores={{ listStore }}
      index={<ListsAppIndex {...props} />}
      statusBar={<ListAppStatusBar />}
    >
      <ListsAppMain {...props} />
    </App>
  )
}

export const app: AppDefinition = {
  name: 'Lists',
  icon: '',
  app: ListsApp,
  appData: {
    rootItemID: 0,
    items: {},
  },
}

export const API = {
  receive(
    app: AppBit,
    parentID: number,
    child: Bit | { id?: number; name?: string; icon?: string; target: 'folder' },
  ) {
    console.log('creating new', app, parentID, child)

    const listApp = app as ListsAppBit
    const item = listApp.data.items[parentID]
    if (!item || (item.type !== 'folder' && item.type !== 'root')) {
      return console.error('NO VALID THING', item, parentID, listApp)
    }

    const id = child.id || Math.random()
    item.children.push(id)

    // add to hash
    if (child.target === 'bit') {
      listApp.data.items[id] = {
        id,
        type: 'bit',
        name: child.title,
      }
    } else if (child.target === 'folder') {
      listApp.data.items[id] = {
        id,
        children: [],
        type: 'folder',
        name: child.name,
        icon: child.icon,
      }
    }

    save(AppModel, app)
  },
}
