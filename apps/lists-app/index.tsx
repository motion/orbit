import { AppMainView, AppNavigator, AppStatusBar, AppViewProps, createApp, NavigatorProps, TreeList, useSearchState, useTreeList } from '@o/kit'
import { Breadcrumb, Breadcrumbs, Dock, DockButton, randomAdjective, randomNoun, StatusBarText, TitleRow, View } from '@o/ui'
import { capitalize } from 'lodash'
import pluralize from 'pluralize'
import React from 'react'

import { API } from './api.node'

export default createApp({
  id: 'lists',
  name: 'Lists',
  icon: 'list',
  iconColors: ['rgb(57, 204, 204)', 'rgb(61, 153, 112)'],
  api: () => API,
  app: () => <AppNavigator index={ListsAppIndex} detail={ListsAppMain} />,
})

const id = 'lists'

export function ListsAppIndex(props: NavigatorProps) {
  const treeList = useTreeList(id)
  useSearchState({
    onChange(search) {
      if (search.query.length) {
        debugger
        treeList.actions.addFolder(search.query)
      }
    },
    onEvent: 'enter',
  })
  return (
    <>
      <TreeList
        use={treeList}
        sortable
        alwaysSelected
        selectable="multi"
        onSelect={props.selectItems}
        itemProps={{
          editable: true,
          deletable: true,
        }}
      />
      <ListAppStatusBar />
      <Dock>
        <DockButton
          id="add"
          icon="plus"
          onClick={() => {
            treeList.actions.addItem({
              name: `${capitalize(randomAdjective())} ${capitalize(randomNoun())}`,
            })
          }}
        />
      </Dock>
    </>
  )
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
  const treeList = useTreeList(id, {
    rootItemID: props.subId ? +props.subId : 0,
    persist: 'tree',
  })
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
    <AppStatusBar>
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
    </AppStatusBar>
  )
}
