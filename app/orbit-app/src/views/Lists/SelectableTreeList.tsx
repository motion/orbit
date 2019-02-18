import { cancel, ensure, react } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import React, { useCallback, useEffect } from 'react'
import { AppConfig } from '../../apps/AppTypes'
import { ListAppDataItem, ListAppDataItemFolder, ListsAppData } from '../../apps/lists/types'
import { Omit } from '../../helpers/typeHelpers/omit'
import { useStores } from '../../hooks/useStores'
import { SelectionStore } from '../../stores/SelectionStore'
import { OrbitListItemProps } from '../ListItems/OrbitListItem'
import SelectableList, { SelectableListProps } from './SelectableList'

type ID = number | string

type SelectableTreeListProps = Omit<SelectableListProps, 'items'> & {
  depth: number
  onChangeDepth?: (depth: number, history: ID[]) => any
  rootItemID: ID
  items: ListsAppData['items']
  loadItemProps: (item: ListAppDataItem) => Promise<OrbitListItemProps>
}

export type SelectableTreeRef = {
  back: Function
  depth: number
}

class SelectableTreeListStore {
  props: Omit<SelectableTreeListProps, 'items'> & {
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
    return this.props.getItems()[this.currentID] as ListAppDataItemFolder
  }

  childrenItems = react(
    () => [this.curFolder, this.props.getItems()],
    async ([curFolder]) => {
      ensure('curFolder', !!curFolder)
      this.ensureValid()
      const { props } = this
      console.log('downloading folder', curFolder)
      return await Promise.all(
        curFolder.children.map(id => props.loadItemProps(props.getItems()[id])),
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
      if (Object.keys(props.getItems()).length) {
        this.error = `No item found root, ${props.rootItemID} current, ${currentID}`
        throw cancel
      } else {
        // just loading if we dont (they passed in items={[]})
      }
      return []
    }
    this.error = null
  }

  handleOpen = (index: number, appConfig?: AppConfig, eventType?: any) => {
    const { curFolder, props, depth } = this
    if (curFolder.type !== 'folder' && curFolder.type !== 'root') {
      console.log('cant open', curFolder, 'not folder or root')
      return
    }
    const nextID = curFolder.children[index]
    const next = props.getItems()[nextID]
    if (next.type === 'folder') {
      const nextDepth = depth + 1
      this.history[nextDepth] = nextID
      this.setDepth(nextDepth)
      this.currentID = nextID
      return
    }
    if (this.props.onOpen) {
      this.props.onOpen(index, appConfig, eventType)
    }
  }
}

export default React.forwardRef<SelectableTreeRef, SelectableTreeListProps>(
  function SelectableTreeList({ items, ...props }, ref) {
    const stores = useStores({ optional: ['selectionStore', 'shortcutStore'] })
    const selectionStore =
      props.selectionStore || stores.selectionStore || useStore(SelectionStore, props)
    const getItems = useCallback(() => items, [items])
    const store = useStore(SelectableTreeListStore, { selectionStore, getItems, ...props })
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
