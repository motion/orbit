import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { default as VirtualList, VirtualListProps } from '../VirtualList/VirtualList'
import { PersonBit, Bit, AppConfig } from '@mcro/models'
import { OrbitListItem } from '../ListItems/OrbitListItem'
import { useStoresSafe } from '../../hooks/useStoresSafe'

export type SearchableItem = (Bit | PersonBit)[]

export type OrbitHandleSelect = false | ((index: number, appConfig: AppConfig) => any)

export type OrbitListProps = VirtualListProps & {
  onSelect: OrbitHandleSelect
  onOpen: OrbitHandleSelect
  query: string
  offsetY?: number
}

export const OrbitList = ({ items, offsetY = 0, ...props }: OrbitListProps) => {
  const { appStore } = useStoresSafe()
  const itemsKey = items
    .map(x => (x.item ? x.item.id || x.item.email : `${x.id || x.email || x.key}`))
    .join(' ')
  const isRowLoaded = React.useCallback(find => find.index < items.length, [itemsKey])

  const list = React.useMemo(
    () => (
      <ProvideHighlightsContextWithDefaults
        value={{
          words: props.query.split(' '),
          maxChars: 500,
          maxSurroundChars: 80,
        }}
      >
        <VirtualList
          key={itemsKey}
          items={items}
          ItemView={OrbitListItem}
          maxHeight={appStore.maxHeight - offsetY}
          isRowLoaded={isRowLoaded}
          {...props}
        />
      </ProvideHighlightsContextWithDefaults>
    ),
    [itemsKey],
  )

  return list
}
