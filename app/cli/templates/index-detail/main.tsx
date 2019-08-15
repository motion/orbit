import { AppContentView, AppNavigator, AppViewProps, createApp, NavigatorProps, useSearchState } from '@o/kit'
import { Dock, DockButton, randomAdjective, randomNoun, TitleRow, TreeList, useTreeList } from '@o/ui'
import { capitalize } from 'lodash'
import React from 'react'

/**
 * Your default export creates the app. Some notes:
 *
 *   1. See createApp type definitions for other features you cand define.
 *   2. See <App /> type definitions for more options on different app layouts.
 *   3. The `api`, `graph`, and `workers` options should all be in their own `.node.ts` files, they are node processes.
 *   4. Run `orbit dev` in this directory to start editing this app!
 */

export default createApp({
  id: '$ID',
  name: '$NAME',
  icon: '$ICON',
  iconColors: ['#111', '#000'],
  app: () => <AppNavigator index={AppIndex} detail={AppMain} />,
})

const id = 'app-$ID'

export function AppIndex(props: NavigatorProps) {
  const treeList = useTreeList(id)
  useSearchState({
    onChange(search) {
      if (search.query.length) {
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

function AppMain(props: AppViewProps) {
  if (props.subType === 'folder') {
    return <AppMainFolder key={props.subId} {...props} />
  }
  return (
    <>
      <TitleRow padding bordered margin={0} title={props.title} />
      <AppContentView {...props} />
    </>
  )
}

function AppMainFolder(props: AppViewProps) {
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
