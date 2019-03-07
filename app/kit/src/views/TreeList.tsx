import { loadMany } from '@o/bridge'
import { BitModel } from '@o/models'
import {
  ListItemProps,
  SelectableTreeItem,
  SelectableTreeList,
  SelectableTreeListProps,
  TreeItems,
  useMemoGetValue,
} from '@o/ui'
import { useHook, useStore } from '@o/use-store'
import { dropRight, last } from 'lodash'
import React, { useMemo } from 'react'
import { useIsAppActive } from '../hooks/useIsAppActive'
import { ScopedAppState, useScopedAppState } from '../hooks/useScopedAppState'
import { ScopedUserState, useScopedUserState } from '../hooks/useScopedUserState'
import { useStoresSimple } from '../hooks/useStores'
import { Omit } from '../types'
import { HighlightActiveQuery } from './HighlightActiveQuery'
import { HandleOrbitSelect } from './List'

export type TreeListProps = Omit<
  SelectableTreeListProps,
  'onSelect' | 'onOpen' | 'loadItemProps'
> & {
  loadItemProps?: SelectableTreeListProps['loadItemProps']
  onSelect?: HandleOrbitSelect
  onOpen?: HandleOrbitSelect
  placeholder?: React.ReactNode
  query?: string
}

type TreeState = { rootItemID: number; items: TreeItems }
type TreeUserState = { depth?: number; currentFolder?: any[] }

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
  ts: () => ScopedAppState<TreeState>,
  us: () => ScopedUserState<TreeUserState>,
) => {
  return {
    addFolder(name?: string) {
      console.log(name, us(), ts())
    },
    selectFolder() {
      console.log(us(), ts())
    },
    back() {},
  }
}

type UseTreeList = {
  state: TreeState
  userState: TreeUserState
  actions: ReturnType<typeof getActions>
}

export function useTreeList(subSelect: string): UseTreeList {
  const ts = useScopedAppState<TreeState>(subSelect, defaultState)
  const us = useScopedUserState(`${subSelect}_treeState`, {
    currentFolder: null,
  })
  const getTs = useMemoGetValue(ts)
  const getUs = useMemoGetValue(us)
  const actions = useMemo(() => getActions(getTs, getUs), [])
  return {
    state: ts[0],
    userState: us[0].currentFolder,
    actions,
  }
}

export class TreeListStore {
  stores = useHook(useStoresSimple)
  props: {
    getItems: (id?: number) => Object
  }

  selectedIndex = 0
  depth = 0
  history = [0]

  onChange = (depth, history) => {
    this.depth = depth
    this.history = history
  }

  loadItemProps = async (ids: SelectableTreeItem[]): Promise<ListItemProps[]> => {
    const bits = await loadMany(BitModel, { args: { where: { id: ids.map(x => +x.id) } } })
    this.stores.appStore.setCurrentItems(bits)
    return []
  }

  get parentId() {
    return last(this.history)
  }

  get currentFolder() {
    return this.props.getItems()[this.parentId]
  }

  get selectedItem() {
    if (!this.currentFolder) {
      return null
    }
    const id = this.currentFolder.children[this.selectedIndex]
    return this.props.getItems()[id]
  }

  back = () => {
    this.depth--
    this.history = dropRight(this.history)
  }
}

export function TreeList({ query, onSelect, onOpen, placeholder, ...props }: TreeListProps) {
  const isActive = useIsAppActive()
  const getItems = useMemoGetValue(props.items)
  const treeListStore = useStore(TreeListStore, { getItems })

  if (!props.items) {
    return null
  }

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
      <SelectableTreeList
        allowMeasure={isActive}
        loadItemProps={treeListStore.loadItemProps}
        onChangeDepth={treeListStore.onChange}
        {...props}
      />
    </HighlightActiveQuery>
  )
}
