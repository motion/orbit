import { App, AppMainView, AppViewProps, getTargetValue, isEqual, TreeList, useBitSearch, useTreeList } from '@o/kit'
import { Breadcrumb, Breadcrumbs, Button, List, ListItemProps, Pane, preventDefault, SearchableTopBar, StatusBarText, TitleRow, useToggle, View } from '@o/ui'
import { flow } from 'lodash'
import pluralize from 'pluralize'
import React, { useEffect, useState } from 'react'

const id = 'my-tree-list'

export function ListApp(props: AppViewProps) {
  return (
    <App index={<ListsAppIndex />} statusBar={<ListAppStatusBar />}>
      <ListsAppMain {...props} />
    </App>
  )
}

export function ListsAppIndex() {
  const treeList = useTreeList(id)
  const [addQuery, setAddQuery] = useState('')
  const hideSearch = useToggle(true)
  const results = useBitSearch({ query: addQuery, take: 20 }).map(item => ({
    ...item,
    after: <Button margin={['auto', 0, 'auto', 10]} icon="plus" />,
  }))
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
        <TreeList use={treeList} sortable />
      </View>
      <Pane
        elevation={1}
        collapsable
        collapsed={hideSearch.val}
        onCollapse={hideSearch.toggle}
        title={results ? `Search Results (${results.length})` : 'Search Results'}
        maxHeight={600}
      >
        <List query={addQuery} items={results || []} />
      </Pane>
    </>
  )
}

function ListsAppMain(props: AppViewProps) {
  if (props.subType === 'folder') {
    return <ListsAppMainFolder {...props} />
  }
  return (
    <>
      <TitleRow bordered margin={0} title={props.title} />
      <AppMainView {...props} />
    </>
  )
}

function ListsAppMainFolder(props: AppViewProps) {
  const treeList = useTreeList(id)
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
        console.log('loaded items', selectedItem.children, items)
        setChildren(cur => {
          if (isEqual(cur, items)) {
            return cur
          }
          return items
        })
      })
    }
  }, [selectedItem && selectedItem.id])

  return <List title={props.title} items={children} />
}

function ListAppStatusBar() {
  const treeList = useTreeList(id)
  const numItems = treeList.state.currentItem.children
    ? treeList.state.currentItem.children.length
    : 0
  return (
    <>
      <Breadcrumbs>
        {treeList.state.history.map(item => (
          <Breadcrumb size={0.9} alpha={0.68} fontWeight={500} key={item.id}>
            {item.name}
          </Breadcrumb>
        ))}
      </Breadcrumbs>
      <View flex={1} />
      <StatusBarText>
        {numItems} {pluralize('item', numItems)}
      </StatusBarText>
    </>
  )
}
