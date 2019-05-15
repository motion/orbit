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

export type TreeListProps = Omit<ListProps, 'items' | 'getItemProps'> & {
  // we should make this either require use or items
  items?: TreeItems
  use?: TreeListStore
  rootItemID?: number
  getItemProps?: (item: TreeItem) => Promise<ListItemProps>
  placeholder?: React.ReactNode
  query?: string
}

type TreeStateStatic = Pick<TreeListProps, 'items' | 'rootItemID'>
type TreeUserState = { depth?: number[]; curId?: number }

// derived state can go here
type TreeState = TreeStateStatic & {
  currentItem: TreeItem
  depth: TreeItem[]
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
    addItem(name: string, item?: Object) {
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
          if (item.children.indexOf(id) > -1) {
            item.children = item.children.filter(x => x !== id)
          }
        }
      })
    },
    sort(oldIndex: number, newIndex: number) {
      const update = treeState()[1]
      update(next => {
        const item = next.items[Actions.curId()]
        item.children = arrayMove(item.children, oldIndex, newIndex)
      })
    },
    curId() {
      return userState()[0].curId || 0
    },
    curItem() {
      return treeState()[0].items[this.curId()]
    },
    selectFolder(id: number) {
      const update = userState()[1]
      update(next => {
        next.curId = id
      })
    },
    back() {
      const update = userState()[1]
      update(next => {
        if (next.depth.length > 0) {
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
  curId: 0,
  depth: [0],
}

const deriveState = (state: TreeStateStatic, userState: TreeUserState): TreeState => ({
  ...state,
  currentItem: state.items[userState.curId],
  depth: userState.depth.map(id => state.items[id]),
})

// persists to app state
export function useTreeList(subSelect: string | false, props?: TreeListProps): TreeListStore {
  // const stores = useStoresSimple()
  const ts = useAppState<TreeStateStatic>(
    subSelect,
    props ? pick(props, 'rootItemID', 'items') : defaultState,
  )
  const us = useUserState(`${subSelect}_treeState`, defaultUserState)
  const getTs = useGet(ts)
  const getUs = useGet(us)
  const actions = useMemo(() => getActions(getTs, getUs /* , stores */), [])
  return {
    state: deriveState(ts[0], us[0]),
    userState: us[0],
    actions,
  }
}

async function loadListItem(item: TreeItem): Promise<ListItemProps> {
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
  const { use, query, getItemProps = loadListItem, ...rest } = props
  const useTree = use || useTreeList(false, props)
  const { rootItemID, items } = useTree.state
  const [loadedItems, setLoadedItems] = useState<ListItemProps[]>([])

  useEffect(() => {
    let cancel = false
    Promise.all(items[rootItemID].children.map(id => getItemProps(items[id]))).then(res => {
      !cancel && setLoadedItems(res)
    })
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

  if (!items) {
    return null
  }

  return (
    <HighlightActiveQuery query={query}>
      <List onSortEnd={handleSortEnd} {...rest} onDelete={handleDelete} items={loadedItems} />
    </HighlightActiveQuery>
  )
}
