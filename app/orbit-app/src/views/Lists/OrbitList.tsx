import { Bit, PersonBit } from '@mcro/models'
import { Text, View, VirtualList, VirtualListProps } from '@mcro/ui'
import React, { useCallback } from 'react'
import { AppConfig } from '../../apps/AppTypes'
import { OrbitHighlightActiveQuery } from '../../components/OrbitHighlightActiveQuery'
import { getAppConfig } from '../../helpers/getAppConfig'
import { Omit } from '../../helpers/typeHelpers/omit'
import { useIsActive } from '../../hooks/useIsActive'
import { Center } from '../Center'
import { OrbitListItem, OrbitListItemProps } from '../ListItems/OrbitListItem'
import { SubTitle } from '../SubTitle'

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
  placeholder?: React.ReactNode
}

export default function OrbitList(props: OrbitListProps) {
  const { items } = props
  const isRowLoaded = useCallback(x => x.index < items.length, [items])
  const isActive = useIsActive()
  const getItemProps = useCallback(
    (item, index, items) => {
      // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
      const normalized = orbitItemToListItemProps(item)
      const extraProps = (props.getItemProps && props.getItemProps(item, index, items)) || null
      return { ...normalized, ...extraProps }
    },
    [props],
  )
  const onSelect = useCallback(
    (index, eventType) => {
      if (props.onSelect) {
        props.onSelect(index, getAppConfig(orbitItemToListItemProps(items[index])), eventType)
      }
    },
    [props],
  )
  const onOpen = useCallback(
    index => {
      if (props.onOpen) {
        props.onOpen(index, getAppConfig(orbitItemToListItemProps(items[index])))
      }
    },
    [props],
  )

  const hasItems = !!props.items.length

  return (
    <OrbitHighlightActiveQuery>
      {hasItems && (
        <VirtualList
          allowMeasure={isActive}
          items={items}
          ItemView={OrbitListItem}
          isRowLoaded={isRowLoaded}
          {...props}
          getItemProps={getItemProps}
          onSelect={onSelect}
          onOpen={onOpen}
        />
      )}
      {!hasItems &&
        (props.placeholder || (
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
        ))}
    </OrbitHighlightActiveQuery>
  )
}
