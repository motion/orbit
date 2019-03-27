import { loadOne } from '@o/bridge'
import { BitModel } from '@o/models'
import { Button, SelectableListProps, TreeItem, useRefGetter } from '@o/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { ScopedAppState, useAppState } from '../hooks/useAppState'
import { ScopedUserState, useUserState } from '../hooks/useUserState'
import { Omit } from '../types'
import { HighlightActiveQuery } from './HighlightActiveQuery'
import { HandleOrbitSelect, List } from './List'
import { OrbitListItemProps } from './ListItem'

type TreeItems = { [key: number]: TreeItem }

export type TreeListProps = Omit<SelectableListProps, 'items' | 'getItemProps'> & {
  use?: UseTreeList
  items?: TreeItems
  rootItemID?: number
  getItemProps?: (item: TreeItem) => Promise<OrbitListItemProps>
  onSelect?: HandleOrbitSelect
  onOpen?: HandleOrbitSelect
  placeholder?: React.ReactNode
  query?: string
}

type TreeState = { rootItemID: number; items: TreeItems }
type TreeUserState = { depth?: number; currentFolder?: number }

const defaultState = {
  rootItemID: 0,
  items: {
    0: {
      id: 0,
      name: 'Root',
      type: 'root',
      children: [],
    },
  },
}

const getActions = (
  treeState: () => ScopedAppState<TreeState>,
  userState: () => ScopedUserState<TreeUserState>,
) => {
  const Actions = {
    addFolder(name?: string) {
      const [state, update] = treeState()
      const curId = Actions.currentFolder()
      const id = Math.random()
      state.items[curId].children.push(id)
      state.items[id] = { id, name, type: 'folder', children: [] }
      update(state)
    },
    currentFolder() {
      return userState()[0].currentFolder || 0
    },
    selectFolder(id: number) {
      const [state, update] = userState()
      state.currentFolder = id
      update(state)
    },
    back() {
      const [state, update] = userState()
      if (state.depth > 0) {
        state.depth--
        update(state)
      }
    },
  }
  return Actions
}

type UseTreeList = {
  state: TreeState
  userState: TreeUserState
  actions: ReturnType<typeof getActions>
}

const defaultUserState = {
  currentFolder: 0,
}

// persists to app state
export function useTreeList(subSelect: string): UseTreeList {
  const ts = useAppState<TreeState>(subSelect, defaultState)
  const us = useUserState(`${subSelect}_treeState`, defaultUserState)
  const getTs = useRefGetter(ts)
  const getUs = useRefGetter(us)
  const actions = useMemo(() => getActions(getTs, getUs), [])
  return {
    state: ts[0],
    userState: us[0],
    actions,
  }
}

async function loadListItem(item: TreeItem): Promise<OrbitListItemProps> {
  switch (item.type) {
    case 'folder':
      return {
        title: item.name,
        subtitle: `${item.children.length} items`,
        after: <Button circular chromeless size={0.9} icon="arrowright" />,
        subId: `${item.id}`,
        subType: 'folder',
      }
    case 'bit':
      return {
        item: await loadOne(BitModel, { args: { where: { id: +item.id } } }),
      }
  }
  return null
}

export function TreeList({
  use,
  query,
  onSelect,
  onOpen,
  placeholder,
  getItemProps = loadListItem,
  ...props
}: TreeListProps) {
  const items = use ? use.state.items : props.items
  const rootItemID = use ? use.state.rootItemID : props.rootItemID
  const [loadedItems, setLoadedItems] = useState([])

  console.warn('render trelist', props, loadedItems)

  useEffect(
    () => {
      let cancel = false
      Promise.all(items[rootItemID].children.map(id => getItemProps(items[id]))).then(res => {
        !cancel && setLoadedItems(res)
      })

      return () => {
        cancel = true
      }
    },
    [items, rootItemID],
  )

  if (!items) {
    return null
  }

  // const activeIndex = useRef(-1)
  // useEffect(
  //   () => {
  //     if (stores.shortcutStore) {
  //       return stores.shortcutStore.onShortcut(shortcut => {
  //         switch (shortcut) {
  //           case 'left':
  //             store.back()
  //             return
  //           case 'right':
  //             store.handleOpen(activeIndex.current)
  //             break
  //         }
  //       })
  //     }
  //   },
  //   [stores],
  // )

  // onSelect={index => {
  //   console.log('ON SELECT', index)
  //   listStore.selectedIndex = index
  // }}
  // depth={listStore.depth}
  // onSortEnd={({ oldIndex, newIndex }) => {
  //   const children = arrayMove(currentFolder.children, oldIndex, newIndex)
  //   listStore.app.data.items = {
  //     ...listStore.app.data.items,
  //     [currentFolder.id]: {
  //       ...currentFolder,
  //       children,
  //     },
  //   }
  //   save(AppModel, listStore.app)
  // }}

  return (
    <HighlightActiveQuery query={query}>
      <List {...props} items={loadedItems} />
    </HighlightActiveQuery>
  )
}
