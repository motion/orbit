import { loadOne } from '@o/bridge'
import { BitModel } from '@o/models'
import { arrayMove } from '@o/react-sortable-hoc'
import { Button, filterCleanObject, List, ListItemProps, ListProps, Loading, TreeItem, useDeepEqualState, useGet } from '@o/ui'
import React, { Suspense, useCallback, useEffect, useMemo, useRef } from 'react'

import { useAppState } from '../hooks/useAppState'
import { ScopedState, useUserState } from '../hooks/useUserState'
import { HighlightActiveQuery } from './HighlightActiveQuery'

type TreeItems = { [key in string | number]: TreeItem }

export type TreeListProps = Omit<ListProps, 'items'> & {
  // we should make this either require use or items
  /** Pass in items to show in the tree */
  items?: TreeItems
  /** Alternate to using items, pass in a treeState you've created from the useCreateTree hook */
  use?: TreeListStore
  /** The root level item to show */
  rootItemID?: number
  /** What to show when empty */
  placeholder?: React.ReactNode
  /** Highlight a query in the tree */
  query?: string
  /** Choose not to persist the treestate/userstate, 'all' is the default value if undefined */
  persist?: 'all' | 'off' | 'tree' | 'user'
  /** Callback when any tree data changes */
  onChange?: (items: TreeItems) => void
}

type TreeStateStatic = Pick<TreeListProps, 'items'>
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
  treeState: () => ScopedState<TreeStateStatic>,
  userState: () => ScopedState<TreeUserState>,
  // stores: KitStores,
) => {
  const Actions = {
    addItem(item?: Partial<TreeItem>, parentId?: number) {
      const update = treeState()[1]
      try {
        update(next => {
          const id = item.id || Math.random()
          next.items[parentId || Actions.curId()].children.push(id)
          next.items[id] = filterCleanObject({ name: '', children: [], ...item, id })
        })
      } catch (err) {
        console.error('error adding', err)
      }
    },
    addItemsFromDrop(items?: any, parentId?: number) {
      if (Array.isArray(items)) {
        for (const item of items) {
          Actions.addItem(
            {
              name: item.title || item.name,
              data: item,
            },
            parentId,
          )
        }
      } else {
        Actions.addItem(
          {
            name: items.title || items.name,
            data: items,
          },
          parentId,
        )
      }
    },
    addFolder(name?: string, parentId?: number) {
      Actions.addItem({ name, type: 'folder' }, parentId)
    },
    deleteItem(id: number | string) {
      const update = treeState()[1]
      update(next => {
        // remove this item
        delete next.items[id]
        // remove any references to this item in .children[]
        for (const key in next.items) {
          const item = next.items[key]
          if (item.children) {
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

const getStateOptions = (stateType: 'tree' | 'user', props?: TreeListProps) => {
  if (!props || !props.persist || props.persist === stateType || props.persist === 'all') {
    return undefined
  }
  return {
    persist: 'off' as const,
  }
}

// persists to app state
export function useTreeList(subSelect: string | false, props?: TreeListProps): TreeListStore {
  // const stores = useStoresSimple()
  const ts = useAppState<TreeStateStatic>(
    subSelect === false ? subSelect : `tlist-${subSelect}`,
    {
      items: (props && props.items) || defaultState.items,
    },
    getStateOptions('tree', props),
  )
  const us = useUserState(`tlist-${subSelect}`, defaultUserState, getStateOptions('user', props))
  const getTs = useGet(ts)
  const getUs = useGet(us)
  const actions = useMemo(() => getActions(getTs, getUs /* , stores */), [])

  useEffect(() => {
    if (props && props.rootItemID) {
      actions.selectFolder(props.rootItemID)
    }
  }, [props && props.rootItemID])

  return {
    state: deriveState(ts[0], us[0]),
    userState: us[0],
    actions,
  }
}

async function loadTreeListItemProps(item?: TreeItem): Promise<ListItemProps> {
  if (!item) {
    return null
  }
  switch (item.type) {
    case 'folder':
      return {
        id: `${item.id}`,
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
  return (
    <Suspense fallback={<Loading />}>
      <TreeListInner {...props} />
    </Suspense>
  )
}

function TreeListInner(props: TreeListProps) {
  const { use, query, onChange, ...rest } = props
  const internal = useTreeList(use ? false : 'state', props)
  const useTree = use || internal
  const { currentItem, items } = useTree.state
  const [loadedItems, setLoadedItems] = useDeepEqualState<ListItemProps[]>([])
  const getOnChange = useGet(onChange)

  useEffect(() => {
    let cancel = false
    Promise.all(items[currentItem.id].children.map(id => loadTreeListItemProps(items[id]))).then(
      next => {
        if (!cancel) {
          setLoadedItems(next.filter(Boolean))
        }
      },
    )
    return () => {
      cancel = true
    }
  }, [items, currentItem.id])

  // onChange callback
  const ignoreInitial = useRef(true)
  useEffect(() => {
    if (getOnChange()) {
      if (ignoreInitial.current) {
        ignoreInitial.current = false
        return
      }
      getOnChange()(items)
    }
  }, [items, getOnChange])

  const handleSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      useTree.actions.sort(oldIndex, newIndex)
    },
    [useTree],
  )

  const handleDelete = useCallback(
    (item: ListItemProps) => {
      useTree.actions.deleteItem(item.id)
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

  const handleDrop = useCallback(
    (items, position) => {
      if (!props.droppable) return
      console.log('dropping item onto list', items)
      if (props.onDrop) {
        props.onDrop(items, position)
      } else {
        useTree.actions.addItemsFromDrop(items)
      }
    },
    [props.onDrop, props.droppable],
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
        onDrop={handleDrop as any}
        items={loadedItems}
      />
    </HighlightActiveQuery>
  )
}
