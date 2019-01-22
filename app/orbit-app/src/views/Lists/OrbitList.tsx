import { AppConfig, Bit, PersonBit } from '@mcro/models'
import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { isEqualReferential } from '../../helpers/isEqualReferential'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { OrbitListItem } from '../ListItems/OrbitListItem'
import { default as VirtualList, VirtualListProps } from '../VirtualList/VirtualList'

export type SearchableItem = (Bit | PersonBit)[]

export type OrbitHandleSelect = ((index: number, appConfig: AppConfig) => any)

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type OrbitListProps = Omit<VirtualListProps, 'onSelect' | 'onOpen'> & {
  onSelect?: OrbitHandleSelect
  onOpen?: OrbitHandleSelect
  query?: string
  offsetY?: number
  itemsKey?: string
}

// fairly sloppy componenent, could be split more cleanly

export function orbitItemsKey(items: any[]) {
  return items
    .map((x, index) => {
      const item = x.item || x
      return `${item.id || item.email || item.key || index}`
    })
    .join(' ')
}

export default React.memo(
  function OrbitList({ items, offsetY = 0, itemsKey, ...props }: OrbitListProps) {
    console.log('re render obrit list')
    const { appStore } = useStoresSafe()
    const itemsKeyFull = itemsKey || orbitItemsKey(items)
    const isRowLoaded = React.useCallback(find => find.index < items.length, [itemsKeyFull])
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
  },
  (a, b) => !![isEqualReferential(a, b), console.log('123', isEqualReferential(a, b))][0],
)
