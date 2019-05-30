import { loadOne } from '@o/bridge'
import { BitModel } from '@o/models'
import { arrayMove } from '@o/react-sortable-hoc'
import { Button, List, ListItemProps, ListProps, TreeItem, useGet } from '@o/ui'
import { pick } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { ScopedAppState, useAppState } from '../hooks/useAppState'
import { ScopedUserState, useUserState } from '../hooks/useUserState'
import { Omit } from '../types'
import { HighlightActiveQuery } from './HighlightActiveQuery'

type TreeItems = { [key: number]: TreeItem }

export type TreeListProps = Omit<ListProps, 'items'> & {
  // we should make this either require use or items
  items?: TreeItems
  use?: TreeListStore
  rootItemID?: number
  placeholder?: React.ReactNode
  query?: string
}

type TreeStateStatic = Pick<TreeListProps, 'items' | 'rootItemID'>
type TreeUserState = {
  depth?: {
    id: number
    selectedIndex: number
  }[]
}

// derived state can go here
type TreeState = TreeStateStatic & {
  // current deepest item
  currentItem: TreeItem
  // current deepest item children
  currentItemChildren: TreeItem[]
  // a breadcrumb history of items leading up to current one
  history: TreeItem[]
}

const defaultState: TreeStateStatic = {
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
  treeState: () => ScopedAppState<TreeStateStatic>,
  userState: () => ScopedUserState<TreeUserState>,
  // stores: KitStores,
) => {
  const Actions = {
    addItem(name: string, item?: Partial<TreeItem>) {
      const update = treeState()[1]
      update(next => {
        const id = Math.random()
        next.items[Actions.curId()].children.push(id)
        next.items[id] = { children: [], ...item, id, name }
      })
    },
    addFolder(name?: string) {
      Actions.addItem(name, { type: 'folder' })
    },
    deleteItem(id: number) {
      const update = treeState()[1]
      update(next => {
        // remove this item
        delete next.items[id]
        // remove any references to this item in .children[]
        for (const key in next.items) {
          const item = next.items[key]
          if (item.children && item.children.indexOf(id) > -1) {
            item.children = item.children.filter(x => x !== id)
          }
        }
      })
    },
    updateItem(item: TreeItem) {
      const update = treeState()[1]
      update(next => {
        const id = item.id
        next.items[id] = item
      })
    },
    updateSelectedItem(item: Partial<TreeItem>) {
      const selectedItem = Actions.getSelectedItem()
      console.log('selectedItem', selectedItem)
      if (!selectedItem) {
        return
      }
      Actions.updateItem({
        ...selectedItem,
        ...item,
      })
    },
    getSelectedItem() {
      const { selectedIndex } = Actions.curDepth()
      console.log('selectedIndex', selectedIndex)
      if (selectedIndex === -1) {
        console.error('No item selected')
        return
      }
      const items = treeState()[0].items
      const curItem = Actions.curItem()
      const curSelectedId = curItem.children[selectedIndex]
      return items[curSelectedId]
    },
    setSelectedIndex(index: number) {
      const update = userState()[1]
      update(draft => {
        const curDepth = draft.depth[draft.depth.length - 1]
        console.log('setSelectedIndex', index, curDepth)
        curDepth.selectedIndex = index
      })
    },
    sort(oldIndex: number, newIndex: number) {
      const update = treeState()[1]
      update(next => {
        const item = next.items[Actions.curId()]
        item.children = arrayMove(item.children, oldIndex, newIndex)
      })
    },
    curDepth() {
      const { depth } = userState()[0]
      return depth[depth.length - 1] || { id: 0, selectedIndex: -1 }
    },
    curItem() {
      return treeState()[0].items[this.curId()]
    },
    curId() {
      return Actions.curDepth().id
    },
    selectFolder(id: number) {
      const update = userState()[1]
      update(next => {
        next.depth.push({ id, selectedIndex: -1 })
      })
    },
    back() {
      const update = userState()[1]
      update(next => {
        if (next.depth.length > 1) {
          next.depth.pop()
        }
      })
    },
  }
  return Actions
}

export type TreeListStore = {
  state: TreeState
  userState: TreeUserState
  actions: ReturnType<typeof getActions>
}

const defaultUserState: TreeUserState = {
  depth: [
    {
      id: 0,
      selectedIndex: -1,
    },
  ],
}

const deriveState = (state: TreeStateStatic, userState: TreeUserState): TreeState => {
  const currentItem = state.items[userState.depth[userState.depth.length - 1].id]
  return {
    ...state,
    currentItem,
    currentItemChildren: currentItem.children.map(x => state.items[x]),
    history: userState.depth.map(item => state.items[item.id]),
  }
}

// persists to app state
export function useTreeList(subSelect: string | false, props?: TreeListProps): TreeListStore {
  // const stores = useStoresSimple()
  const ts = useAppState<TreeStateStatic>(
    subSelect,
    props ? pick(props, 'rootItemID', 'items') : defaultState,
  )
  const us = useUserState(`${subSelect}-tree-state`, defaultUserState)
  const getTs = useGet(ts)
  const getUs = useGet(us)
  const actions = useMemo(() => getActions(getTs, getUs /* , stores */), [])
  return {
    state: deriveState(ts[0], us[0]),
    userState: us[0],
    actions,
  }
}

async function loadTreeListItemProps(item: TreeItem): Promise<ListItemProps> {
  switch (item.type) {
    case 'folder':
      return {
        title: item.name,
        subTitle: `${item.children.length} items`,
        after: <Button circular chromeless iconSize={14} icon="chevron-right" />,
        subId: `${item.id}`,
        subType: 'folder',
      }
    case 'bit':
      return {
        item: await loadOne(BitModel, { args: { where: { id: +item.id } } }),
      }
    default:
      return {
        id: `${item.id}`,
        title: item.name,
        subTitle: findAttribute(item, 'subTitle'),
        subId: findAttribute(item, 'subId'),
        subType: findAttribute(item, 'subType'),
      }
  }
}

const findAttribute = (item: TreeItem, key: string) =>
  (item.attributes && item.attributes.find(x => x.value === key).value) || ''

export function TreeList(props: TreeListProps) {
  const { use, query, ...rest } = props
  const useTree = use || useTreeList(false, props)
  const { rootItemID, items } = useTree.state
  const [loadedItems, setLoadedItems] = useState<ListItemProps[]>([])

  useEffect(() => {
    let cancel = false
    Promise.all(items[rootItemID].children.map(id => loadTreeListItemProps(items[id]))).then(
      res => {
        !cancel && setLoadedItems(res)
      },
    )
    return () => {
      cancel = true
    }
  }, [items, rootItemID])

  const handleSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      useTree.actions.sort(oldIndex, newIndex)
    },
    [useTree],
  )

  const handleDelete = useCallback(
    (item: ListItemProps) => {
      useTree.actions.deleteItem(+item.id)
    },
    [useTree],
  )

  const handleEditTitle = useCallback(
    (item: TreeItem, name: string) => {
      item.name = name
      useTree.actions.updateItem(item)
    },
    [useTree],
  )

  const handleSelect = useCallback(
    (rows: any[], indices: number[]) => {
      if (indices.length) {
        useTree.actions.setSelectedIndex(indices[0])
      }
      if (props.onSelect) {
        props.onSelect(rows, indices)
      }
    },
    [props.onSelect],
  )

  if (!items) {
    return null
  }

  return (
    <HighlightActiveQuery query={query}>
      <List
        onEdit={handleEditTitle}
        onSortEnd={handleSortEnd}
        {...rest}
        onSelect={handleSelect}
        onDelete={handleDelete}
        items={loadedItems}
      />
    </HighlightActiveQuery>
  )
}
