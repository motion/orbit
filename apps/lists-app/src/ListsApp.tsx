import { App, AppMainView, AppViewProps, TreeList, useSearchState, useTreeList } from '@o/kit'
import { Breadcrumb, Breadcrumbs, StatusBarText, TitleRow, View } from '@o/ui'
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

  useSearchState({
    onChange(search) {
      treeList.actions.addFolder(search.query)
    },
    onEvent: 'enter',
  })

  return <TreeList use={treeList} sortable />
}

function ListsAppMain(props: AppViewProps) {
  if (props.subType === 'folder') {
    return <ListsAppMainFolder key={props.subId} {...props} />
  }
  return (
    <>
      <TitleRow bordered margin={0} title={props.title} />
      <AppMainView {...props} />
    </>
  )
}

function ListsAppMainFolder(props: AppViewProps) {
  const treeList = useTreeList(
    id,
    {
      rootItemID: +props.subId,
    },
    {
      persist: 'tree',
    },
  )
  console.log('listid', props.subId, treeList)
  return (
    <TreeList
      use={treeList}
      title={props.title}
      items={treeList.state.items}
      droppable
      sortable
      onDrop={items => {
        console.log('dropped an item', items)
        treeList.actions.addItemsFromDrop(items)
      }}
      onChange={items => {
        console.log('got an update, persist back to main list', items)
      }}
    />
  )
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
