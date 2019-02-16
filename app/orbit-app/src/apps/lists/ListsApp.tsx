import { SaveOptions } from '@mcro/mediator';
import { AppBit, AppModel, Bit } from '@mcro/models';
import { useStore } from '@mcro/use-store';
import React from 'react';
import { save } from '../../mediator';
import { AppContainer } from '../AppContainer';
import { App } from '../AppTypes';
import { ListsAppIndex } from './ListsAppIndex';
import { ListsAppMain } from './ListsAppMain';
import { ListAppStatusBar } from './ListsAppStatusBar';
import { ListStore } from './ListStore';
import { ListsAppBit, ListsAppData } from './types';

export const listRootID = 0

export const ListsApp: App<ListsAppData> = props => {
  const listStore = useStore(ListStore, props)
  return (
    <AppContainer
      provideStores={{ listStore }}
      index={<ListsAppIndex {...props} />}
      statusBar={<ListAppStatusBar />}
    >
      <ListsAppMain {...props} />
    </AppContainer>
  )
}

ListsApp.defaultValue = {
  rootItemID: 0,
  items: {},
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
      debugger
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
