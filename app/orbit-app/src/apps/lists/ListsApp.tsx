import { SaveOptions } from '@mcro/mediator';
import { save } from '@mcro/model-bridge';
import { AppBit, AppModel, Bit } from '@mcro/models';
import { useStore } from '@mcro/use-store';
import React from 'react';
import { AppContainer } from '../AppContainer';
import { App, AppProps } from '../AppTypes';
import ListsAppIndex from './ListsAppIndex';
import ListsAppMain from './ListsAppMain';
import ListsAppStatusBar from './ListsAppStatusBar';
import { ListStore } from './ListStore';
import { ListsAppBit, ListsAppData } from './types';

export const listRootID = 0
export type ListAppProps = AppProps & {
  store: ListStore
}

export const ListsApp: App<ListsAppData> = (props) => {
  const store = useStore(ListStore, props)
  return (
    <AppContainer
      index={<ListsAppIndex {...props} store={store} />}
      statusBar={<ListsAppStatusBar {...props} store={store} />}
    >
      <ListsAppMain {...props} store={store} />
    </AppContainer>
  )
}

ListsApp.defaultValue = {
  rootItemID: 0,
  items: {}
}

ListsApp.api = {
  receive(
    app: AppBit,
    parentID: number,
    child: Bit | { id?: number; name?: string; icon?: string; target: 'folder' },
  ) {
    const listApp = app as ListsAppBit
    const item = listApp.data.items[parentID]
    if (!item || (item.type !== 'folder' && item.type !== 'root')) {
      console.error('NO VALID THING', item, parentID, listApp)
      return
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