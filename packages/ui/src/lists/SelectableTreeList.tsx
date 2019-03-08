import { always, cancel, ensure, react, useStore } from '@o/use-store'
import React from 'react'
import { useStores } from '../helpers/useStores'
import { useMemoGetValue } from '../hooks/useMemoGetValue'
import { usePropsWithMemoFunctions } from '../hooks/usePropsWithMemoFunctions'
import { TreeItem } from '../Tree'
import { Omit } from '../types'
import { ListItemProps } from './ListItem'
import { SelectableList, SelectableListProps } from './SelectableList'
import { SelectionStore } from './SelectionStore'

// TODO we have similar but not aligned types with Tree.tsx

type BaseTreeItem = { id: number; type?: string; name?: string }
type TreeItemFolder = BaseTreeItem & { type: 'folder'; name?: string; children: number[] }

export type SelectableTreeItem = BaseTreeItem | TreeItemFolder

export type TreeItems = { [key: number]: TreeItem }

export type SelectableTreeListProps = Omit<SelectableListProps, 'items'> & {
  rootItemID?: number
  items: TreeItems
  depth?: number
  onLoadItems?: (items: ListItemProps[]) => any
  loadItemProps: (items: SelectableTreeItem[]) => Promise<ListItemProps[]>
  selectionStore?: SelectionStore
}

class SelectableTreeListStore {
  props: SelectableTreeListProps & {
    getItems: () => TreeItems
    selectionStore: SelectionStore
  }

  currentID = this.props.rootItemID
  error = null

  get curFolder() {
    console.log('this.props.items', this.props.items)
    return this.props.items[this.currentID] as TreeItemFolder
  }

  loadedItems = react(
    () => [this.curFolder, always(this.props.items)],
    async ([curFolder]) => {
      ensure('curFolder', !!curFolder)
      this.ensureValid()
      debugger
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

  handleOpen = (index: number, appProps?: any, eventType?: any) => {
    const { curFolder, props } = this
    if (curFolder.type !== 'folder' && curFolder.type !== 'root') {
      console.log('cant open', curFolder, 'not folder or root')
      return
    }
    const nextID = curFolder.children[index]
    const next = props.items[nextID]
    if (next.type === 'folder') {
      this.currentID = nextID
      return
    }
    if (this.props.onOpen) {
      this.props.onOpen(index, appProps, eventType)
    }
  }
}

export function SelectableTreeList({
  rootItemID = 0,
  items,
  ...restProps
}: SelectableTreeListProps) {
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
}
