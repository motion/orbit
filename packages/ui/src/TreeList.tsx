import { arrayMove } from '@o/react-sortable-hoc'
import { createStoreContext, useStore } from '@o/use-store'
import { ScopedState } from '@o/utils'
import React, { memo, Suspense, useCallback, useEffect, useMemo, useRef } from 'react'

import { Button } from './buttons/Button'
import { Config } from './helpers/configureUI'
import { filterCleanObject } from './helpers/filterCleanObject'
import { memoIsEqualDeep } from './helpers/memoHelpers'
import { useDeepEqualState } from './hooks/useDeepEqualState'
import { useGet } from './hooks/useGet'
import { List, ListProps } from './lists/List'
import { ListItemProps } from './lists/ListItem'
import { Loading } from './progress/Loading'
import { TreeItem } from './Tree'

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

class TreeListStore {
  props: {
    treeState: ScopedState<TreeStateStatic>
    userState: ScopedState<TreeUserState>
  }

  get treeState() {
    return this.props.treeState[0]
  }
  get treeStateUpdate() {
    return this.props.treeState[1]
  }
  get userState() {
    return this.props.userState[0]
  }
  get userStateUpdate() {
    return this.props.userState[1]
  }

  get state(): TreeState | null {
    const { treeState, userState } = this
    if (!treeState) {
      return null
    }
    const currentItem = treeState.items[userState.depth[userState.depth.length - 1].id]
    return {
      ...treeState,
      currentItem,
      currentItemChildren: ((currentItem && currentItem.children) || [])
        .map(x => treeState.items[x])
        .filter(Boolean),
      history: userState.depth.map(item => treeState.items[item.id]),
    }
  }

  addItem(item?: Partial<TreeItem>, parentId?: number) {
    try {
      this.treeStateUpdate(next => {
        const id = item.id || Math.random()
        next.items[parentId || this.curId()].children.push(id)
        next.items[id] = filterCleanObject({ name: '', children: [], ...item, id })
      })
    } catch (err) {
      console.error('error adding', err)
    }
  }

  addItemsFromDrop(items?: any, parentId?: number) {
    const addItem = x => {
      // should normalize fancier
      const item = x.type === 'row' ? x.values : x.item || x
      let name = item.title || item.name
      if (typeof name !== 'string') {
        if (name) {
          name = Object.keys(name)
            .map(k => name[k])
            .join(', ')
        } else {
          name = Object.keys(x)
            .slice(0, 3)
            .map(k => x[k])
            .join(', ')
        }
      }
      this.addItem(
        {
          name,
          data: item,
        },
        parentId,
      )
    }
    if (Array.isArray(items)) {
      items.forEach(addItem)
    } else {
      addItem(items)
    }
  }

  addFolder(name?: string, parentId?: number) {
    this.addItem({ name, type: 'folder' }, parentId)
  }

  deleteItem(id: number) {
    this.treeStateUpdate(next => {
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
  }

  updateItem(item: TreeItem) {
    this.treeStateUpdate(next => {
      const id = item.id
      next.items[id] = item
    })
  }

  updateSelectedItem(item: Partial<TreeItem>) {
    const selectedItem = this.getSelectedItem()
    // console.log('updating', selectedItem, item)
    if (!selectedItem) {
      return
    }
    this.updateItem({
      ...selectedItem,
      ...item,
    })
  }

  getSelectedItem() {
    const { selectedIndex } = this.curDepth()
    if (selectedIndex === -1) {
      console.error('No item selected')
      return
    }
    const items = this.treeState.items
    const curItem = this.curItem()
    const curSelectedId = curItem.children[selectedIndex]
    return items[curSelectedId]
  }

  setSelectedIndex(index: number) {
    this.userStateUpdate(draft => {
      draft.depth[draft.depth.length - 1].selectedIndex = index
    })
  }

  sort(oldIndex: number, newIndex: number) {
    this.treeStateUpdate(next => {
      const item = next.items[this.curId()]
      item.children = arrayMove(item.children, oldIndex, newIndex)
    })
  }

  curDepth() {
    const { depth } = this.userState
    return depth[depth.length - 1] || { id: 0, selectedIndex: -1 }
  }

  curItem() {
    return this.treeState.items[this.curId()]
  }

  curId() {
    return this.curDepth().id
  }

  selectFolder(id: number) {
    this.userStateUpdate(next => {
      next.depth.push({ id, selectedIndex: -1 })
    })
  }

  back() {
    this.userStateUpdate(next => {
      if (next.depth.length > 1) {
        next.depth.pop()
      }
    })
  }
}

const defaultUserState: TreeUserState = {
  depth: [
    {
      id: 0,
      selectedIndex: -1,
    },
  ],
}

const getStateOptions = (stateType: 'tree' | 'user', props?: TreeListProps) => {
  if (!props || !props.persist || props.persist === stateType || props.persist === 'all') {
    return undefined
  }
  return {
    persist: 'off' as const,
  }
}

const ContextualTreeListStore = createStoreContext(TreeListStore)
export const ProvideTreeList = ContextualTreeListStore.ProvideStore
export const useTreeList = ContextualTreeListStore.useStore

/**
 * For creating a new treeList manually
 */
export function useCreateTreeList(subSelect: string | false, props?: TreeListProps): TreeListStore {
  const treeState = Config.useAppState<TreeStateStatic>(
    subSelect === false ? subSelect : `tl-${subSelect}`,
    {
      items: (props && props.items) || defaultState.items,
    },
    getStateOptions('tree', props),
  )
  const userState = Config.useUserState(
    `tl-us-${subSelect}`,
    defaultUserState,
    getStateOptions('user', props),
  )
  const treeListStore = ContextualTreeListStore.useCreateStore({ treeState, userState })

  useEffect(() => {
    if (props && props.rootItemID) {
      treeListStore.selectFolder(props.rootItemID)
    }
  }, [props && props.rootItemID])

  return treeListStore
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
      if (Config.loadBit) {
        return {
          id: `${item.id}`,
          item: await Config.loadBit(+item.id),
        }
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

export const TreeList = memoIsEqualDeep(
  (props: TreeListProps) => {
    return (
      <Suspense fallback={<Loading />}>
        <TreeListInner {...props} />
      </Suspense>
    )
  },
  {
    simpleCompareKeys: {
      items: true,
    },
  },
)

function TreeListInner(props: TreeListProps) {
  const { use, onChange, ...rest } = props
  const internal = useCreateTreeList(use ? false : 'state', props)
  const external = useStore(use || false)
  const useTree = external || internal
  const { currentItem, items } = useTree.state
  const [loadedItems, setLoadedItems] = useDeepEqualState<ListItemProps[]>([])
  const getOnChange = useGet(onChange)
  const curItemKey = JSON.stringify(currentItem)

  // this should update quickly on sort changes, preserving last loaded items
  const finalItems = useMemo(() => {
    return items[currentItem.id].children
      .map(id => loadedItems.find(item => `${id}` === item.id))
      .filter(Boolean)
  }, [items, loadedItems, curItemKey])

  useEffect(() => {
    if (!currentItem) return
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
  }, [items, curItemKey])

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
      useTree.sort(oldIndex, newIndex)
    },
    [useTree],
  )

  const handleDelete = useCallback(
    (item: ListItemProps) => {
      useTree.deleteItem(+item.id)
    },
    [useTree],
  )

  const handleEditTitle = useCallback(
    (item: TreeItem, name: string) => {
      item.name = name
      useTree.updateItem(item)
    },
    [useTree],
  )

  const handleSelect = useCallback(
    (rows: any[], indices: number[]) => {
      if (indices.length) {
        useTree.setSelectedIndex(indices[0])
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
        useTree.addItemsFromDrop(items)
      }
    },
    [props.onDrop, props.droppable],
  )

  if (!items) {
    return null
  }

  return (
    <List
      onEdit={handleEditTitle}
      onSortEnd={handleSortEnd}
      {...rest}
      onSelect={handleSelect}
      onDelete={handleDelete}
      onDrop={handleDrop as any}
      items={finalItems}
    />
  )
}
