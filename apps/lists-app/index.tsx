import { AppNavigator, AppStatusBar, AppViewProps, createApp, Editor, NavigatorProps, useBit, useSearchState } from '@o/kit'
import { Breadcrumb, Breadcrumbs, Col, Dock, DockButton, ProvideTreeList, randomAdjective, randomNoun, StatusBarText, TreeList, useCreateTreeList, useDebounce, useTreeList, View } from '@o/ui'
import { capitalize } from 'lodash'
import pluralize from 'pluralize'
import React, { useCallback, useRef } from 'react'

import { API } from './api.node'

export default createApp({
  id: 'lists',
  name: 'Lists',
  icon: 'list',
  iconColors: ['rgb(57, 204, 204)', 'rgb(61, 153, 112)'],
  api: () => API,
  app: () => {
    const treeList = useCreateTreeList(id)
    return (
      <ProvideTreeList value={treeList}>
        <AppNavigator index={ListsAppIndex} detail={ListsAppMain} />
      </ProvideTreeList>
    )
  },
})

const id = 'lists'

export function ListsAppIndex(props: NavigatorProps) {
  const treeList = useTreeList()

  useSearchState({
    onChange(search) {
      if (search.query.length) {
        treeList.addFolder(search.query)
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
            treeList.addItem({
              name: `${capitalize(randomAdjective())} ${capitalize(randomNoun())}`,
            })
          }}
        />
      </Dock>
    </>
  )
}

function ListsAppMain(props: AppViewProps) {
  const treeList = useTreeList()
  const [bit, updateBit] = useBit(`main-content-${props.id}`, {
    defaultValue: {
      title: props.title,
    },
  })

  const ignoreFirst = useRef(true)
  const handleChange = useDebounce(getVal => {
    if (ignoreFirst.current) {
      ignoreFirst.current = false
      return
    }
    const val = getVal()
    updateBit(next => {
      next.body = val
      const title = val.split('\n')[0].slice(2, Infinity)
      next.title = title
      treeList.updateSelectedItem({ name: title })
    })
  }, 300)

  if (props.subType === 'folder') {
    return <ListsAppMainFolder key={props.subId} {...props} />
  }

  return (
    <Col padding={[30, 0]}>
      <Editor defaultValue={`${bit.body}`} onChange={handleChange} />
      {/* TODO put this in a modal when you click a plus here */}
      {/* <AppContentView {...props} /> */}
    </Col>
  )
}

function ListsAppMainFolder(props: AppViewProps) {
  const treeList = useCreateTreeList(id, {
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
      onDrop={useCallback(items => {
        console.log('dropped an item', items)
        treeList.addItemsFromDrop(items)
      }, [])}
    />
  )
}

function ListAppStatusBar() {
  const treeList = useCreateTreeList(id)
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
