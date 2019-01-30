import { AppConfig, Bit, PersonBit } from '@mcro/models'
import { Text, View } from '@mcro/ui'
import * as React from 'react'
import { OrbitHighlightActiveQuery } from '../../components/OrbitHighlightActiveQuery'
import { getAppConfig } from '../../helpers/getAppConfig'
import { Omit } from '../../helpers/typeHelpers/omit'
import { Center } from '../Center'
import { OrbitListItem } from '../ListItems/OrbitListItem'
import { SubTitle } from '../SubTitle'
import { default as VirtualList, VirtualListProps } from '../VirtualList/VirtualList'

export type SearchableItem = (Bit | PersonBit)[]

export type OrbitHandleSelect = ((
  index: number,
  appConfig: AppConfig,
  eventType?: 'click' | 'key',
) => any)

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
        placeholder={
          <View flex={1} minHeight={200}>
            <Center alignItems="center">
              <View>
                <SubTitle>No results</SubTitle>
                {!!props.query && (
                  <Text ellipse size={0.95} alpha={0.6}>
                    "{props.query}"
                  </Text>
                )}
              </View>
            </Center>
          </View>
        }
      />
    </OrbitHighlightActiveQuery>
  )
}
