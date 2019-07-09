import { App, AppMainView, AppViewProps, isEqual, TreeList, useSearchState, useTreeList } from '@o/kit'
import { Breadcrumb, Breadcrumbs, List, ListItemProps, StatusBarText, TitleRow, View } from '@o/ui'
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

  return (
    <List
      droppable
      onDrop={item => {
        console.log('dropped an item', item)
      }}
      title={props.title}
      items={children}
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
