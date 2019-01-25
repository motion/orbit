import { AppConfig, Bit, PersonBit } from '@mcro/models'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { getAppConfig } from '../../helpers/getAppConfig'
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
  itemsKey?: string
}

export default observer(function OrbitList({ items, itemsKey, ...props }: OrbitListProps) {
  const { appStore, selectionStore } = useStoresSafe({ optional: ['selectionStore'] })
  const isRowLoaded = x => x.index < items.length
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
        isRowLoaded={isRowLoaded}
        {...props}
        onSelect={(index, eventType) => {
          if (selectionStore && selectionStore.activeIndex !== index) {
            selectionStore.toggleSelected(index, eventType)
          }
          if (props.onSelect) {
            props.onSelect(index, getAppConfig(items[index], index))
          }
        }}
        onOpen={index => {
          if (props.onOpen) {
            props.onOpen(index, getAppConfig(items[index], index))
          }
        }}
      />
    </ProvideHighlightsContextWithDefaults>
  )
})
