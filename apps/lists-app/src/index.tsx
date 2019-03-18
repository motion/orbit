import { App, AppBit, AppModel, AppProps, Bit, createApp, save } from '@o/kit'
import React from 'react'
import { ListsAppIndex } from './ListsAppIndex'
import { ListsAppMain } from './ListsAppMain'
import { ListAppStatusBar } from './ListsAppStatusBar'
import { ListsAppBit } from './types'

function ListApp(props: AppProps) {
  return (
    <App index={<ListsAppIndex />} statusBar={<ListAppStatusBar />}>
      <ListsAppMain {...props} />
    </App>
  )
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

export default createApp({
  id: 'lists',
  name: 'Lists',
  icon: '',
  app: ListApp,
  API,
  appData: {
    rootItemID: 0,
    items: {},
  },
})
