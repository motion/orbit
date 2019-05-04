import { App, AppBit, AppModel, AppProps, Bit, createApp, save, AppMainView } from '@o/kit'
import { ListAppStatusBar } from './ListsAppStatusBar'
import { ListsAppBit } from './types'
import { ensure, getTargetValue, searchBits, TreeList, useReaction, useTreeList } from '@o/kit'
import {
  ListItemProps,
  TitleRow,
  TitleRowProps,
  Button,
  List,
  Pane,
  preventDefault,
  SearchableTopBar,
  useToggle,
  View,
} from '@o/ui'
import { flow } from 'lodash'
import React, { useEffect, useState } from 'react'

export function ListsAppIndex() {
  const treeList = useTreeList('list')
  const [addQuery, setAddQuery] = useState('')
  const hideSearch = useToggle(true)

  const searchResults = useReaction(
    async (_, { sleep }) => {
      ensure('query', !!addQuery)
      await sleep(100)
      const results = await searchBits({ query: addQuery, take: 20 })
      return results.map(item => ({
        ...item,
        after: <Button margin={['auto', 0, 'auto', 10]} icon="plus" />,
      }))
    },
    {
      defaultValue: [],
    },
    [addQuery],
  )

  return (
    <>
      <SearchableTopBar
        value={addQuery}
        onChange={flow(
          preventDefault,
          getTargetValue,
          setAddQuery,
        )}
        onEnter={() => treeList.actions.addFolder(addQuery)}
        placeholder="Add..."
        buttons={
          <>
            <Button
              active={hideSearch.val}
              tooltip="Search to add"
              icon="plus"
              onClick={hideSearch.toggle}
            />
            <Button
              tooltip="Create folder"
              icon="folder-new"
              onClick={() => treeList.actions.addFolder(addQuery)}
            />
          </>
        }
      />

      <View flex={1}>
        <TreeList
          use={treeList}
          sortable
          // actions={['delete']}
        />
      </View>

      <Pane
        elevation={1}
        collapsable
        collapsed={hideSearch.val}
        onCollapse={hideSearch.toggle}
        title={searchResults ? `Search Results (${searchResults.length})` : 'Search Results'}
        maxHeight={600}
        // background
      >
        <List search={addQuery} items={searchResults || []} />
      </Pane>
    </>
  )
}

// for <TreeList />
// getContextMenu={index => {
//   return [
//     {
//       label: 'Delete',
//       click: () => {
//         console.log('delete item', index)
//       },
//     },
//   ]
// }}

export function ListsAppMain(props: AppProps) {
  if (props.subType === 'folder') {
    return <ListsAppMainFolder {...props} />
  }
  return (
    <>
      <ListAppTitle title={props.title || 'hi'} />
      <AppMainView {...props} />
    </>
  )
}

function ListAppTitle(props: TitleRowProps) {
  return <TitleRow bordered sizePadding={2} margin={0} {...props} />
}

function ListsAppMainFolder(props: AppProps) {
  const treeList = useTreeList('list')
  const selectedItem = treeList.userState.currentFolder[+props.subId]
  const [children, setChildren] = useState<ListItemProps[]>([])

  useEffect(() => {
    if (selectedItem && selectedItem.type === 'folder') {
      Promise.all(
        selectedItem.children.map(id => {
          return { id }
          // return loadListItem(list.data.items[id])
        }),
      ).then(items => {
        setChildren(items)
      })
    }
  }, [selectedItem && selectedItem.id])

  // treeList.userState.depth > 0 && (
  //   <Button icon="checkron-left" onClick={treeList.actions.back}>
  //     Back
  //   </Button>
  // )
  return <List title={props.title} items={children} />
}

function ListApp(props: AppProps) {
  console.log('props', props)
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
  api: () => API,
  appData: {
    rootItemID: 0,
    items: {},
  },
})
