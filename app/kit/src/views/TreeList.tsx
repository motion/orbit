import { loadOne } from '@o/bridge'
import { BitModel } from '@o/models'
import { arrayMove } from '@o/react-sortable-hoc'
import { Button, List, ListItemProps, ListProps, TreeItem, useGet } from '@o/ui'
import { pick } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { ScopedAppState, useAppState } from '../hooks/useAppState'
import { useStoresSimple } from '../hooks/useStores'
import { ScopedUserState, useUserState } from '../hooks/useUserState'
import { KitStores } from '../stores'
import { Omit } from '../types'
import { HighlightActiveQuery } from './HighlightActiveQuery'

type TreeItems = { [key: number]: TreeItem }

export type TreeListProps = Omit<ListProps, 'items' | 'getItemProps'> & {
  // we should make this either require use or items
  items?: TreeItems
  use?: UseTreeList
  rootItemID?: number
  getItemProps?: (item: TreeItem) => Promise<ListItemProps>
  placeholder?: React.ReactNode
  query?: string
}

type TreeStateStatic = Pick<TreeListProps, 'items' | 'rootItemID'>
type TreeUserState = { depth?: number; curId?: number }

// derived state can go here
type TreeState = TreeStateStatic & {
  currentItem: TreeItem
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
  stores: KitStores,
) => {
  const Actions = {
    addFolder(name?: string) {
      const [_, update] = treeState()
      update(next => {
        const id = Math.random()
        next.items[Actions.curId()].children.push(id)
        next.items[id] = { id, name, type: 'folder', children: [] }
      })
      stores.queryStore.clearQuery()
    },
    sort(oldIndex: number, newIndex: number) {
      const [_, update] = treeState()
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
      const [state, update] = userState()
      state.curId = id
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
  curId: 0,
}

const deriveState = (state: TreeStateStatic, userState: TreeUserState): TreeState => ({
  ...state,
  currentItem: state.items[userState.curId],
})

// persists to app state
export function useTreeList(subSelect: string | false, props?: TreeListProps): UseTreeList {
  const stores = useStoresSimple()
  const ts = useAppState<TreeStateStatic>(
    subSelect,
    props ? pick(props, 'rootItemID', 'items') : defaultState,
  )
  const us = useUserState(`${subSelect}_treeState`, defaultUserState)
  const getTs = useGet(ts)
  const getUs = useGet(us)
  const actions = useMemo(() => getActions(getTs, getUs, stores), [])
  return {
    state: deriveState(ts[0], us[0]),
    userState: us[0],
    actions,
  }
}

const itemArrowRight = <Button circular chromeless iconSize={14} icon="chevron-right" />

async function loadListItem(item: TreeItem): Promise<ListItemProps> {
  switch (item.type) {
    case 'folder':
      return {
        title: item.name,
        subTitle: `${item.children.length} items`,
        after: itemArrowRight,
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

  if (!items) {
    return null
  }

  return (
    <HighlightActiveQuery query={query}>
      <List onSortEnd={handleSortEnd} {...rest} items={loadedItems} />
    </HighlightActiveQuery>
  )
}
