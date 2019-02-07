import { SaveOptions } from '@mcro/mediator'
import { loadOne, save } from '@mcro/model-bridge'
import { AppModel, Bit, BitModel, ListAppDataItem, ListsApp, PersonBitModel } from '@mcro/models'
import { Button } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import React from 'react'
import { OrbitListItemProps } from '../../views/ListItems/OrbitListItem'
import { AppProps, AppViews } from '../AppTypes'
import ListsAppIndex from './ListsAppIndex'
import ListsAppMain from './ListsAppMain'
import { ListStore } from './ListStore'

export const listRootID = 0

export type ListAppProps = AppProps & {
  store: ListStore
}

export function ListsApp(props: AppProps): AppViews {
  const store = useStore(ListStore, props)
  return {
    index: props => <ListsAppIndex {...props} store={store} />,
    main: props => <ListsAppMain {...props} store={store} />,
  }
}

ListsApp.api = {
  receive(
    app: ListsApp,
    parentID: number,
    child: Bit | { id?: number; name?: string; icon?: string; target: 'folder' },
  ) {
    const item = app.data.items[parentID]
    if (item.type !== 'folder' && item.type !== 'root') {
      throw new Error('Invalid parent to add')
    }

    const id = child.id || Math.random()
    item.children.push(id)

    // add to hash
    if (child.target === 'bit') {
      app.data.items[id] = {
        id,
        type: 'bit',
        name: child.title,
      }
    } else if (child.target === 'folder') {
      app.data.items[id] = {
        id,
        children: [],
        type: 'folder',
        name: child.name,
        icon: child.icon,
      }
    }

    save(AppModel, app as SaveOptions<ListsApp>)
  },
}

export async function loadListItem(
  item?: ListAppDataItem,
  listId?: number,
): Promise<OrbitListItemProps> {
  switch (item.type) {
    case 'folder':
      return {
        title: item.name,
        subtitle: `${item.children.length} items`,
        after: <Button circular chromeless size={0.9} icon="arrowright" />,
        appConfig: {
          id: `${listId || -1}`,
          subId: `${item.id}`,
          subType: 'folder',
        },
      }
    case 'bit':
      return {
        item: await loadOne(BitModel, { args: { where: { id: +item.id } } }),
      }
    case 'person':
      return {
        item: await loadOne(PersonBitModel, { args: { where: { id: +item.id } } }),
      }
  }
  return null
}

// export const lists = {
//   index: ListsAppIndex,
//   main: ListsAppMain,
//   actions: {
//     // TODO add person
//     receive(
//       app: ListsApp,
//       parentID: number,
//       child: Bit | { id?: number; name?: string; icon?: string; target: 'folder' },
//     ) {
//       const item = app.data.items[parentID]

//       if (item.type !== 'folder' && item.type !== 'root') {
//         throw new Error('Invalid parent to add')
//       }

//       const id = child.id || Math.random()
//       item.children.push(id)

//       // add to hash
//       if (child.target === 'bit') {
//         app.data.items[id] = {
//           id,
//           type: 'bit',
//           name: child.title,
//         }
//       }

//       if (child.target === 'folder') {
//         app.data.items[id] = {
//           id,
//           children: [],
//           type: 'folder',
//           name: child.name,
//           icon: child.icon,
//         }
//       }

//       save(AppModel, app as SaveOptions<ListsApp>)
//     },
//   },
// }
