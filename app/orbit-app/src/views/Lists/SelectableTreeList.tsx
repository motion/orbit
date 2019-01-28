import { ListAppDataItem, ListsAppData } from '@mcro/models'
import { Omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { OrbitListItemProps } from '../ListItems/OrbitListItem'
import SelectableList, { SelectableListProps } from './SelectableList'

type SelectableTreeListProps = Omit<SelectableListProps, 'items'> & {
  rootItemID: ListsAppData['rootItemID']
  items: ListsAppData['items']
  onLoadItem: (item: ListAppDataItem) => Promise<OrbitListItemProps>
}

export function SelectableTreeList(props: SelectableTreeListProps) {
  const [depth, setDepth] = useState(0)
  const [currentItemID, setCurrentItemID] = useState(props.rootItemID)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  // Update items
  useEffect(
    () => {
      if (!props.items[currentItemID]) {
        setError(`No item found with id ${currentItemID}`)
        return
      }
      let cancelled = false
      const items = Promise.all(
        props.items[currentItemID].children.map(id => props.onLoadItem(props.items[id])),
      )
      items.then(nextItems => {
        if (!cancelled) {
          console.log('got', nextItems)
          setItems(nextItems)
        }
      })
      return () => {
        cancelled = true
      }
    },
    [JSON.stringify(Object.keys(props.items))],
  )

  console.log('render', items)

  return (
    <>
      {error && <div>SelectableTreeListError: {error}</div>}
      {!error && <SelectableList {...props} items={items} />}
    </>
  )
}
