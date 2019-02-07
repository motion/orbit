import { SaveOptions } from '@mcro/mediator'
import { save } from '@mcro/model-bridge'
import { AppBit, AppModel, Bit } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import React from 'react'
import { App } from '../App'
import { AppProps } from '../AppTypes'
import ListsAppIndex from './ListsAppIndex'
import ListsAppMain from './ListsAppMain'
import { ListStore } from './ListStore'
import { ListsAppBit } from './types'

export const listRootID = 0

export type ListAppProps = AppProps & {
  store: ListStore
}

export function ListsApp(props: AppProps) {
  const store = useStore(ListStore, props)
  return (
    <App index={<ListsAppIndex {...props} store={store} />}>
      <ListsAppMain {...props} store={store} />
    </App>
  )
}

ListsApp.api = {
  receive(
    app: AppBit,
    parentID: number,
    child: Bit | { id?: number; name?: string; icon?: string; target: 'folder' },
  ) {
    const listApp = app as ListsAppBit
    const item = listApp.data.items[parentID]
    if (item.type !== 'folder' && item.type !== 'root') {
      throw new Error('Invalid parent to add')
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

    // TODO @umed type issue
    // @ts-ignore
    save(AppModel, app as SaveOptions<ListsAppBit>)
  },
}
