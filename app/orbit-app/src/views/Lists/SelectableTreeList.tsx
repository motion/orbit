import { ListAppDataItem, ListsAppData } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import { Omit } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { SelectionStore } from '../../stores/SelectionStore'
import { OrbitListItemProps } from '../ListItems/OrbitListItem'
import SelectableList, { SelectableListProps } from './SelectableList'

type ID = number | string

type SelectableTreeListProps = Omit<SelectableListProps, 'items'> & {
  depth?: number
  onChangeDepth?: (depth: number, history: ID[]) => any
  rootItemID: ID
  items: ListsAppData['items']
  loadItem: (item: ListAppDataItem) => Promise<OrbitListItemProps>
}

export type SelectableTreeRef = {
  back: Function
  depth: number
}

// class SelectableTreeListStore {
//   props: SelectableTreeListProps
//   currentID = this
//   depth = 0
//   history = []
//   error = null
//   loadedItems = {}
// }

export default React.forwardRef(function SelectableTreeList(props: SelectableTreeListProps, ref) {
  const stores = useStoresSafe({ optional: ['selectionStore', 'shortcutStore'] })
  const selectionStore =
    props.selectionStore || stores.selectionStore || useStore(SelectionStore, props)

  // move to reducer or store?
  // const [state, dispatch] = useReducer({
  //   currentId: 0,
  //   error: null,
  //   history: [],
  //   depth: 0,
  //   loadedItems: {}
  // })

  const [currentItemID, setCurrentItemID] = useState(props.rootItemID)
  const currentItem = props.items[currentItemID]
  const [childrenItems, setChildrenItems] = useState([])
  const [error, setError] = useState('')
  const history = useRef([props.rootItemID])
  const [depth, setDepthPrivate] = useState(0)
  const getDepth = useRef(0)

  console.log('render with', currentItem, childrenItems)

  // keep history in sync with depth
  const setDepth = (next: number) => {
    history.current = history.current.slice(0, next + 1)
    getDepth.current = next
    setDepthPrivate(next)
  }
  const setDepthWithCallback = (depth: number) => {
    setDepth(depth)
    if (props.onChangeDepth) {
      props.onChangeDepth(depth, [...history.current])
    }
  }

  const back = () => depth > 0 && setDepthWithCallback(depth - 1)

  useEffect(
    function syncDepthPropToState() {
      if (props.depth !== depth) {
        setDepth(props.depth)
      }
      const nextItemID = history.current[props.depth]
      if (typeof nextItemID === 'number' && nextItemID !== currentItemID) {
        console.log('updating current item from props change')
        setCurrentItemID(nextItemID)
      }
    },
    [props.depth, depth],
  )

  useEffect(
    function updateRef() {
      ref['current'] = {
        back,
        depth,
      }
    },
    [depth],
  )

  useEffect(
    function fetchItems() {
      if (!currentItem || (currentItem.type !== 'folder' && currentItem.type !== 'root')) {
        // error if we have items
        if (Object.keys(props.items).length) {
          setError(
            `No item found root, ${
              props.rootItemID
            } current, ${currentItemID}, items ${JSON.stringify(props.items)}`,
          )
        } else {
          // just loading if we dont (they passed in items={[]})
        }
        return
      }
      setError(null)
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
    [JSON.stringify(currentItem), currentItemID],
  )

  const handleOpen = useCallback(
    function handleOpen(index, appConfig?, eventType?) {
      if (currentItem.type !== 'folder' && currentItem.type !== 'root') {
        console.log('cant open', currentItem, 'not folder or root')
        return
      }
      const nextID = currentItem.children[index]
      const next = props.items[nextID]

      if (next.type === 'folder') {
        const nextDepth = getDepth.current + 1
        history.current[nextDepth] = nextID
        setDepthWithCallback(nextDepth)
        setCurrentItemID(nextID)
        return
      }

      if (props.onOpen) {
        props.onOpen(index, appConfig, eventType)
      }
    },
    [JSON.stringify(currentItem), currentItemID],
  )

  useEffect(
    function handleShortcuts() {
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
