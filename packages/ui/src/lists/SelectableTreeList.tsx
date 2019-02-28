import { always, cancel, ensure, react, useStore } from '@mcro/use-store'
import React, { forwardRef, useCallback, useEffect } from 'react'
import { useStores } from '../helpers/useStores'
import { usePropsWithMemoFunctions } from '../hooks/usePropsWithMemoFunctions'
import { Omit } from '../types'
import { ListItemProps } from './ListItem'
import { SelectableList, SelectableListProps } from './SelectableList'
import { SelectionStore } from './SelectionStore'
// import { ListAppDataItem, ListAppDataItemFolder, ListsAppData } from ''

// !TODO restore types
type ListsAppData = {
  items?: any
}
type ListAppDataItem = { type: string }
type ListAppDataItemFolder = { type: 'folder'; children: number[] }

type ID = number | string

type SelectableTreeListProps = Omit<SelectableListProps, 'items'> & {
  depth: number
  onChangeDepth?: (depth: number, history: ID[]) => any
  rootItemID: ID
  items: ListsAppData['items']
  loadItemProps: (item: ListAppDataItem) => Promise<ListItemProps>
  selectionStore?: SelectionStore
}

export type SelectableTreeRef = {
  back: Function
  depth: number
}

class SelectableTreeListStore {
  props: SelectableTreeListProps & {
    getItems: () => ListsAppData['items']
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
    return this.props.items[this.currentID] as ListAppDataItemFolder
  }

  childrenItems = react(
    () => [this.curFolder, always(this.props.items)],
    async ([curFolder]) => {
      ensure('curFolder', !!curFolder)
      this.ensureValid()
      const { props } = this
      return await Promise.all(
        curFolder.children
          .filter(x => !!props.items[x])
          .map(id => props.loadItemProps(props.items[id])),
      )
    },
    {
      defaultValue: [],
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
  function SelectableTreeList({ items, ...restProps }, ref) {
    const props = usePropsWithMemoFunctions(restProps)
    const stores = useStores({ optional: ['selectionStore', 'shortcutStore'] })
    const selectionStore =
      props.selectionStore || stores.selectionStore || useStore(SelectionStore, props)
    const getItems = useCallback(() => items, [items])
    // TODO why does getItems not trigger a change...
    const store = useStore(SelectableTreeListStore, { selectionStore, items, getItems, ...props })
    const { error } = store

    useEffect(
      () => {
        ref && (ref['current'] = store)
      },
      [store],
    )

    useEffect(function handleShortcuts() {
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
    }, [])

    return (
      <>
        {error && <div>SelectableTreeListError: {error}</div>}
        {!error && (
          <SelectableList
            {...props}
            selectionStore={selectionStore}
            onOpen={store.handleOpen}
            items={store.childrenItems}
          />
        )}
      </>
    )
  },
)
