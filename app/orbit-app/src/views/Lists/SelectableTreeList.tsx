import { ListAppDataItem, ListsAppData } from '@mcro/models'
import { Omit } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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

  useEffect(
    () => {
      ref['current'] = {
        back: () => depth > 0 && setDepthWithCallback(depth - 1),
        depth,
      }
    },
    [depth],
  )

  // Update items
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

  const onOpen = useCallback(
    (index, appConfig, eventType) => {
      const nextID = currentItem.children[index]
      const next = props.items[nextID]

      if (next.type === 'folder') {
        const nextDepth = depth + 1
        setDepthWithCallback(nextDepth)
        history.current[nextDepth] = nextID
        setCurrentItemID(nextID)
        return
      }

      props.onOpen(index, appConfig, eventType)
    },
    [currentItemID],
  )

  return (
    <>
      {error && <div>SelectableTreeListError: {error}</div>}
      {!error && <SelectableList {...props} onOpen={onOpen} items={childrenItems} />}
    </>
  )
})
