import {
  App,
  AppBit,
  AppMainView,
  AppModel,
  AppProps,
  Bit,
  createApp,
  ensure,
  getTargetValue,
  Icon,
  save,
  searchBits,
  TreeList,
  useReaction,
  useTreeList,
} from '@o/kit'
import {
  Breadcrumbs,
  Button,
  ButtonProps,
  List,
  ListItemProps,
  Pane,
  preventDefault,
  SearchableTopBar,
  StatusBarText,
  Text,
  TitleRow,
  TitleRowProps,
  useBreadcrumb,
  useToggle,
  View,
} from '@o/ui'
import { flow } from 'lodash'
import pluralize from 'pluralize'
import React, { useEffect, useState } from 'react'

import { ListsAppBit } from './types'

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
  const selectedItem = treeList.state.items[+props.subId]
  const [children, setChildren] = useState<ListItemProps[]>([])

  useEffect(() => {
    if (selectedItem && selectedItem.type === 'folder') {
      Promise.all(
        selectedItem.children.map(id => {
          return { id: `${id}` }
          // return loadListItem(list.data.items[id])
        }),
      ).then(items => {
        setChildren(items)
      })
    }
  }, [selectedItem && selectedItem.id])

  return <List title={props.title} items={children} />
}

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
  api: () => API,
  appData: {
    rootItemID: 0,
    items: {},
  },
})

export function ListAppStatusBar() {
  const numItems = 0

  return (
    <>
      <ListAppBreadcrumbs
        items={[
          {
            id: 0,
            name: <Icon name="home" size={12} opacity={0.5} />,
          },
          // ...listStore.history
          //   .slice(1)
          //   .filter(Boolean)
          //   .map(id => listStore.items[id]),
          // listStore.selectedItem,
        ].filter(Boolean)}
      />
      <View flex={1} />
      <StatusBarText>
        {numItems} {pluralize('item', numItems)}
      </StatusBarText>
    </>
  )
}

function ListCrumb(props: ButtonProps) {
  const { isLast } = useBreadcrumb()

  return (
    <>
      <Button {...props} />
      {!isLast ? (
        <Text size={1.5} fontWeight={900} alpha={0.5} margin={[0, 5]} height={4} lineHeight={0}>
          {' · '}
        </Text>
      ) : null}
    </>
  )
}

function ListAppBreadcrumbs(props: { items: { id: any; name: React.ReactNode }[] }) {
  return (
    <View flex={1}>
      <Breadcrumbs>
        {props.items.map((item, index) => (
          <ListCrumb key={`${item.id}${index}`}>{item.name}</ListCrumb>
        ))}
      </Breadcrumbs>
    </View>
  )
}
