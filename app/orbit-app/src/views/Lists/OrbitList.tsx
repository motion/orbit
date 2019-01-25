import { AppConfig, Bit, PersonBit } from '@mcro/models'
import * as React from 'react'
import { OrbitHighlightActiveQuery } from '../../components/OrbitHighlightActiveQuery'
import { getAppConfig } from '../../helpers/getAppConfig'
import { OrbitListItem } from '../ListItems/OrbitListItem'
import { default as VirtualList, VirtualListProps } from '../VirtualList/VirtualList'

export type SearchableItem = (Bit | PersonBit)[]

export type OrbitHandleSelect = ((
  index: number,
  appConfig: AppConfig,
  eventType?: 'click' | 'key',
) => any)

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type OrbitListProps = Omit<VirtualListProps, 'onSelect' | 'onOpen'> & {
  onSelect?: OrbitHandleSelect
  onOpen?: OrbitHandleSelect
  query?: string
  itemsKey?: string
}

export default function OrbitList({ items, itemsKey, ...props }: OrbitListProps) {
  const isRowLoaded = x => x.index < items.length
  return (
    <OrbitHighlightActiveQuery>
      <VirtualList
        items={items}
        ItemView={OrbitListItem}
        isRowLoaded={isRowLoaded}
        {...props}
        onSelect={(index, eventType) => {
          if (props.onSelect) {
            props.onSelect(index, getAppConfig(items[index], index), eventType)
          }
        }}
        onOpen={index => {
          if (props.onOpen) {
            props.onOpen(index, getAppConfig(items[index], index))
          }
        }}
      />
    </OrbitHighlightActiveQuery>
  )
}
