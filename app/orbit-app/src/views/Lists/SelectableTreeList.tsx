import { ListAppDataItem, ListsAppData } from '@mcro/models'
import { Omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { OrbitListItemProps } from '../ListItems/OrbitListItem'
import SelectableList, { SelectableListProps } from './SelectableList'

type SelectableTreeListProps = Omit<SelectableListProps, 'items'> & {
  rootItemID: ListsAppData['rootItemID']
  items: ListsAppData['items']
  loadItem: (item: ListAppDataItem) => Promise<OrbitListItemProps>
}

export type SelectableTreeRef = {
  back: Function
}

export default React.forwardRef(function SelectableTreeList(props: SelectableTreeListProps, ref) {
  const [depth, setDepth] = useState(0)
  const [currentItemID, setCurrentItemID] = useState(props.rootItemID)
  const currentItem = props.items[currentItemID]
  const [childrenItems, setChildrenItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    ref['current'] = {
      back: () => depth > 1 && setDepth(depth - 1),
    }
  }, [])

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
          console.log('got', nextItems)
          setChildrenItems(nextItems)
        }
      })
      return () => {
        cancelled = true
      }
    },
    [JSON.stringify(props.items), currentItemID],
  )

  return (
    <>
      {error && <div>SelectableTreeListError: {error}</div>}
      {!error && (
        <SelectableList
          {...props}
          onOpen={(index, appConfig, eventType) => {
            const nextID = currentItem.children[index]
            const next = props.items[nextID]

            if (next.type === 'folder') {
              console.log('drill into folder', index, nextID)
              setDepth(depth + 1)
              setCurrentItemID(nextID)
              return
            }

            props.onOpen(index, appConfig, eventType)
          }}
          items={childrenItems}
        />
      )}
    </>
  )
})
