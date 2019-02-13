import { AppConfig, Bit, PersonBit } from '@mcro/models'
import { Text, View } from '@mcro/ui'
import * as React from 'react'
import { OrbitHighlightActiveQuery } from '../../components/OrbitHighlightActiveQuery'
import { getAppConfig } from '../../helpers/getAppConfig'
import { Omit } from '../../helpers/typeHelpers/omit'
import { Center } from '../Center'
import { OrbitListItem, OrbitListItemProps } from '../ListItems/OrbitListItem'
import { SubTitle } from '../SubTitle'
import { default as VirtualList, VirtualListProps } from '../VirtualList/VirtualList'

export type SearchableItem = Bit | PersonBit

export type Item = SearchableItem | OrbitListItemProps

export function orbitItemToListItemProps(props: any): OrbitListItemProps {
  if (props.target) {
    return { item: props }
  }
  return props as any
}

export type OrbitHandleSelect = ((
  index: number,
  appConfig: AppConfig,
  eventType?: 'click' | 'key',
) => any)

export type OrbitListProps = Omit<VirtualListProps<any>, 'onSelect' | 'onOpen' | 'items'> & {
  items?: Item[]
  onSelect?: OrbitHandleSelect
  onOpen?: OrbitHandleSelect
  query?: string
}

export default function OrbitList(props: OrbitListProps) {
  const { items } = props
  const isRowLoaded = x => x.index < items.length
  const getItemProps = React.useCallback(
    (item, index, items) => {
      // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
      const normalized = orbitItemToListItemProps(item)
      const extraProps = (props.getItemProps && props.getItemProps(item, index, items)) || null
      return { ...normalized, ...extraProps }
    },
    [props],
  )
  const onSelect = React.useCallback(
    (index, eventType) => {
      if (props.onSelect) {
        props.onSelect(index, getAppConfig(orbitItemToListItemProps(items[index])), eventType)
      }
    },
    [props],
  )
  const onOpen = React.useCallback(
    index => {
      if (props.onOpen) {
        props.onOpen(index, getAppConfig(orbitItemToListItemProps(items[index])))
      }
    },
    [props],
  )

  return (
    <OrbitHighlightActiveQuery>
      <VirtualList
        items={items}
        ItemView={OrbitListItem}
        isRowLoaded={isRowLoaded}
        {...props}
        getItemProps={getItemProps}
        onSelect={onSelect}
        onOpen={onOpen}
        placeholder={
          <View flex={1} minHeight={200} position="relative">
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
