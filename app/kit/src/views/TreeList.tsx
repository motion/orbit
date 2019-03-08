import { ListItemProps, SelectableListProps, TreeItem, useMemoGetValue } from '@o/ui'
import React, { useMemo } from 'react'
import { ScopedAppState, useScopedAppState } from '../hooks/useScopedAppState'
import { ScopedUserState, useScopedUserState } from '../hooks/useScopedUserState'
import { Omit } from '../types'
import { HighlightActiveQuery } from './HighlightActiveQuery'
import { HandleOrbitSelect } from './List'

type TreeItems = { [key: number]: TreeItem }

export type TreeListProps = Omit<SelectableListProps, 'items'> & {
  items: TreeItems
  rootItemID?: number
  getItemProps?: (items: TreeItem[]) => Promise<ListItemProps[]>
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

export function useTreeList(subSelect: string): UseTreeList {
  const ts = useScopedAppState<TreeState>(subSelect, defaultState)
  const us = useScopedUserState(`${subSelect}_treeState`, {
    currentFolder: 0,
  })
  const getTs = useMemoGetValue(ts)
  const getUs = useMemoGetValue(us)
  const actions = useMemo(() => getActions(getTs, getUs), [])
  return {
    state: ts[0],
    userState: us[0],
    actions,
  }
}

export function TreeList({ query, onSelect, onOpen, placeholder, ...props }: TreeListProps) {
  // const stores = useStoresSimple()
  // const isActive = useIsAppActive()

  if (!props.items) {
    return null
  }

  console.warn('render trelist', props)

  // const getItemProps = useCallback(async (ids: TreeItem[]): Promise<ListItemProps[]> => {
  //   console.log('loading item props', ids)
  //   const bits = await loadMany(BitModel, { args: { where: { id: ids.map(x => +x.id) } } })
  //   return bits.map(toListItemProps)
  // }, [])

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
      {/* <ListStack allowMeasure={isActive} {...props} /> */}
    </HighlightActiveQuery>
  )
}
