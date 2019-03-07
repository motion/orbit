import { always, cancel, ensure, react, useStore } from '@o/use-store'
import React, { forwardRef, useEffect } from 'react'
import { useStores } from '../helpers/useStores'
import { useMemoGetValue } from '../hooks/useMemoGetValue'
import { usePropsWithMemoFunctions } from '../hooks/usePropsWithMemoFunctions'
import { Omit } from '../types'
import { ListItemProps } from './ListItem'
import { SelectableList, SelectableListProps } from './SelectableList'
import { SelectionStore } from './SelectionStore'

// TODO we have similar but not aligned types with Tree.tsx

type BaseTreeItem = { id: string | number; type: string }
type TreeItemFolder = BaseTreeItem & { type: 'folder'; children: number[] }
export type SelectableTreeItem = BaseTreeItem | TreeItemFolder

export type TreeItems = { [key: string]: SelectableTreeItem }

export type SelectableTreeListProps = Omit<SelectableListProps, 'items'> & {
  rootItemID?: number
  items: TreeItems
  depth?: number
  onLoadItems?: (items: ListItemProps[]) => any
  onChangeDepth?: (depth: number, history: number[]) => void
  loadItemProps: (items: SelectableTreeItem[]) => Promise<ListItemProps[]>
  selectionStore?: SelectionStore
}

export type SelectableTreeRef = {
  back: Function
  depth: number
}

class SelectableTreeListStore {
  props: SelectableTreeListProps & {
    getItems: () => TreeItems
    selectionStore: SelectionStore
  }

  currentID = this.props.rootItemID
  history = [this.props.rootItemID]
  error = null
  depth = this.props.depth

  syncDepthProp = react(
    () => this.props.depth,
    next => {
      this.depth = next
      this.currentID = this.history[next]
    },
  )

  back = () => {
    if (this.depth > 0) {
      this.setDepth(this.depth - 1)
    }
  }

  setDepth = (next: number) => {
    this.history = this.history.slice(0, next + 1)
    this.depth = next
    if (this.props.onChangeDepth) {
      this.props.onChangeDepth(next, [...this.history])
    }
  }

  get curFolder() {
    return this.props.items[this.currentID] as TreeItemFolder
  }

  loadedItems = react(
    () => [this.curFolder, always(this.props.items)],
    async ([curFolder]) => {
      ensure('curFolder', !!curFolder)
      this.ensureValid()
      return await this.props.loadItemProps(curFolder.children.map(x => this.props.items[x]))
    },
    {
      defaultValue: [],
    },
  )

  onLoadItemsCallback = react(
    () => this.loadedItems,
    () => {
      if (this.props.onLoadItems) {
        this.props.onLoadItems(this.loadedItems)
      }
    },
  )

  ensureValid() {
    const { curFolder, currentID, props } = this
    if (!curFolder || (curFolder.type !== 'folder' && curFolder.type !== 'root')) {
      // error if we have items
      if (Object.keys(props.items).length) {
        this.error = `No item found root, ${props.rootItemID} current, ${currentID}`
        throw cancel
      }
    }
    this.error = null
  }

  handleOpen = (index: number, appConfig?: any, eventType?: any) => {
    const { curFolder, props, depth } = this
    if (curFolder.type !== 'folder' && curFolder.type !== 'root') {
      console.log('cant open', curFolder, 'not folder or root')
      return
    }
    const nextID = curFolder.children[index]
    const next = props.items[nextID]
    if (next.type === 'folder') {
      const nextDepth = depth + 1
      this.history[nextDepth] = nextID
      this.setDepth(nextDepth)
      this.currentID = nextID
      return
    }
    if (this.props.onOpen) {
      // !TODO
      this.props.onOpen(index, appConfig, eventType)
    }
  }
}

export const SelectableTreeList = forwardRef<SelectableTreeRef, SelectableTreeListProps>(
  function SelectableTreeList({ rootItemID = 0, items, ...restProps }, ref) {
    const props = {
      rootItemID,
      ...usePropsWithMemoFunctions(restProps),
    }
    const stores = useStores({ optional: ['selectionStore', 'shortcutStore'] })
    const selectionStore =
      props.selectionStore || stores.selectionStore || useStore(SelectionStore, props)
    const getItems = useMemoGetValue(items)
    const store = useStore(SelectableTreeListStore, { selectionStore, items, getItems, ...props })
    const { error } = store

    useEffect(
      () => {
        ref && (ref['current'] = store)
      },
      [store],
    )

    useEffect(
      () => {
        if (selectionStore && stores.shortcutStore) {
          return stores.shortcutStore.onShortcut(shortcut => {
            switch (shortcut) {
              case 'left':
                store.back()
                return
              case 'right':
                store.handleOpen(selectionStore.activeIndex)
                break
            }
          })
        }
      },
      [selectionStore, stores.shortcutStore],
    )

    return (
      <>
        {error && <div>SelectableTreeListError: {error}</div>}
        {!error && (
          <SelectableList
            {...props}
            selectionStore={selectionStore}
            onOpen={store.handleOpen}
            items={store.loadedItems}
          />
        )}
      </>
    )
  },
)
