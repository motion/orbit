import { ListAppDataItem, ListsAppData } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import { Omit } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { SelectionStore } from '../../stores/SelectionStore'
import { OrbitListItemProps } from '../ListItems/OrbitListItem'
import SelectableList, { SelectableListProps } from './SelectableList'

type SelectableTreeListProps = Omit<SelectableListProps, 'items'> & {
  depth?: number
  onChangeDepth?: (depth: number) => any
  rootItemID: ListsAppData['rootItemID']
  items: ListsAppData['items']
  loadItem: (item: ListAppDataItem) => Promise<OrbitListItemProps>
}

export type SelectableTreeRef = {
  back: Function
  depth: number
}

export default React.forwardRef(function SelectableTreeList(props: SelectableTreeListProps, ref) {
  const stores = useStoresSafe({ optional: ['selectionStore', 'shortcutStore'] })
  const selectionStore =
    props.selectionStore || stores.selectionStore || useStore(SelectionStore, props)
  const [currentItemID, setCurrentItemID] = useState(props.rootItemID)
  const currentItem = props.items[currentItemID]
  const [childrenItems, setChildrenItems] = useState([])
  const [error, setError] = useState('')
  const history = useRef([props.rootItemID])
  const [depth, setDepth] = useState(0)
  const setDepthWithCallback = (depth: number) => {
    setDepth(depth)
    if (props.onChangeDepth) {
      props.onChangeDepth(depth)
    }
  }

  const back = () => depth > 0 && setDepthWithCallback(depth - 1)

  // props.depth => depth
  useEffect(
    () => {
      setDepth(props.depth)
      const nextItemID = history.current[props.depth]
      if (typeof nextItemID === 'number' && nextItemID !== currentItemID) {
        console.log('updating current item from props change')
        setCurrentItemID(nextItemID)
      }
    },
    [props.depth],
  )

  // updateRef
  useEffect(
    () => {
      ref['current'] = {
        back,
        depth,
      }
    },
    [depth],
  )

  // fetch items
  useEffect(
    () => {
      if (!currentItem) {
        setError(`No item found with id ${currentItemID}`)
        return
      }
      let cancelled = false
      const items = Promise.all(currentItem.children.map(id => props.loadItem(props.items[id])))
      items.then(nextItems => {
        if (!cancelled) {
          setChildrenItems(nextItems)
        }
      })
      return () => {
        cancelled = true
      }
    },
    [JSON.stringify(props.items), currentItemID],
  )

  const handleOpen = useCallback(
    (index, appConfig?, eventType?) => {
      const nextID = currentItem.children[index]
      const next = props.items[nextID]

      if (next.type === 'folder') {
        const nextDepth = depth + 1
        setDepthWithCallback(nextDepth)
        history.current[nextDepth] = nextID
        setCurrentItemID(nextID)
        return
      }

      if (props.onOpen) {
        props.onOpen(index, appConfig, eventType)
      }
    },
    [currentItemID],
  )

  // handle shortcuts
  useEffect(
    () => {
      if (selectionStore && stores.shortcutStore) {
        return stores.shortcutStore.onShortcut(shortcut => {
          switch (shortcut) {
            case 'left':
              back()
              return
            case 'right':
              handleOpen(selectionStore.activeIndex)
              break
          }
        })
      }
    },
    [currentItemID],
  )

  return (
    <>
      {error && <div>SelectableTreeListError: {error}</div>}
      {!error && (
        <SelectableList
          {...props}
          selectionStore={selectionStore}
          onOpen={handleOpen}
          items={childrenItems}
        />
      )}
    </>
  )
})
