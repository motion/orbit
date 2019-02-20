import { Bit, PersonBit } from '@mcro/models'
import { Center, SelectableList, SubTitle, Text, View, VirtualListProps } from '@mcro/ui'
import React, { useCallback } from 'react'
import { getAppConfig } from '../helpers/getAppConfig'
import { useIsAppActive } from '../hooks/useIsAppActive'
import { Omit } from '../types'
import { AppConfig } from '../types/AppConfig'
import { HighlightActiveQuery } from './HighlightActiveQuery'
import { ListItem, OrbitListItemProps } from './ListItem'

export type SearchableItem = Bit | PersonBit

export type Item = SearchableItem | OrbitListItemProps

export function toListItemProps(props: any): OrbitListItemProps {
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

export type ListProps = Omit<VirtualListProps<any>, 'onSelect' | 'onOpen' | 'items'> & {
  items?: Item[]
  onSelect?: OrbitHandleSelect
  onOpen?: OrbitHandleSelect
  query?: string
  placeholder?: React.ReactNode
}

export function List(props: ListProps) {
  const { items } = props
  const isRowLoaded = useCallback(x => x.index < items.length, [items])
  const isActive = useIsAppActive()
  const getItemProps = useCallback(
    (item, index, items) => {
      // this will convert raw PersonBit or Bit into { item: PersonBit | Bit }
      const normalized = toListItemProps(item)
      const extraProps = (props.getItemProps && props.getItemProps(item, index, items)) || null
      return { ...normalized, ...extraProps }
    },
    [props],
  )
  const onSelect = useCallback(
    (index, eventType) => {
      if (props.onSelect) {
        props.onSelect(index, getAppConfig(toListItemProps(items[index])), eventType)
      }
    },
    [props],
  )
  const onOpen = useCallback(
    index => {
      if (props.onOpen) {
        props.onOpen(index, getAppConfig(toListItemProps(items[index])))
      }
    },
    [props],
  )

  const hasItems = !!props.items.length

  return (
    <HighlightActiveQuery>
      {hasItems && (
        <SelectableList
          allowMeasure={isActive}
          items={items}
          ItemView={ListItem}
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
    </HighlightActiveQuery>
  )
}
