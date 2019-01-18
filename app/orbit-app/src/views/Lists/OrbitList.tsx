import { AppConfig, Bit, PersonBit } from '@mcro/models'
import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { OrbitListItem } from '../ListItems/OrbitListItem'
import { default as VirtualList, VirtualListProps } from '../VirtualList/VirtualList'

export type SearchableItem = (Bit | PersonBit)[]

export type OrbitHandleSelect = ((index: number, appConfig: AppConfig) => any)

export type OrbitListProps = VirtualListProps & {
  onSelect?: OrbitHandleSelect
  onOpen?: OrbitHandleSelect
  query?: string
  offsetY?: number
}

// fairly sloppy componenent, could be split more cleanly

export const orbitItemsKey = items =>
  items.map(x => (x.item ? x.item.id || x.item.email : `${x.id || x.email || x.key}`)).join(' ')

export function OrbitList({ items, offsetY = 0, ...props }: OrbitListProps) {
  const { appStore } = useStoresSafe()
  const itemsKey = orbitItemsKey(items)
  const isRowLoaded = React.useCallback(find => find.index < items.length, [itemsKey])
  return (
    <ProvideHighlightsContextWithDefaults
      value={{
        words: (props.query || appStore.activeQuery).split(' '),
        maxChars: 500,
        maxSurroundChars: 80,
      }}
    >
      <VirtualList
        items={items}
        ItemView={OrbitListItem}
        maxHeight={appStore.maxHeight - offsetY}
        isRowLoaded={isRowLoaded}
        {...props}
      />
    </ProvideHighlightsContextWithDefaults>
  )
}
