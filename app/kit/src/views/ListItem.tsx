import { gloss } from '@o/gloss'
import { Bit } from '@o/models'
import {
  ListItem as UIListItem,
  ListItemProps,
  PersonRow,
  SelectableStore,
  VirtualListItemProps,
} from '@o/ui'
import React, { memo, useCallback } from 'react'
import { normalizeItem } from '../helpers/normalizeItem'
import { useStoresSimple } from '../hooks/useStores'
import { Omit } from '../types'
import { AppProps } from '../types/AppProps'
import { NormalItem } from '../types/NormalItem'
import { OrbitItemViewProps } from '../types/OrbitItemViewProps'
import { listItemDecorators } from './itemViews'

export type ListItemComponent = React.FunctionComponent<OrbitItemViewProps> & {
  getItemProps?: (item: any) => OrbitListItemProps
}

export type OrbitListItemProps = Omit<VirtualListItemProps<Bit>, 'index'> & {
  // Bit | any
  index?: number
  // for appconfig merge
  id?: string
  identifier?: string
  subType?: string
  // extra props for orbit list items
  people?: Bit[]
  hidePeople?: boolean
  itemViewProps?: OrbitItemViewProps
  appProps?: AppProps
  selectableStore?: SelectableStore
}

export const ListItem = memo(
  ({ item, itemViewProps, people, hidePeople, selectableStore, ...props }: OrbitListItemProps) => {
    const { appStore } = useStoresSimple()

    // this is the view from sources, each bit type can have its own display
    let ItemView: ListItemComponent = null
    let itemProps: Partial<ListItemProps> = null
    let normalized: NormalItem = null
    let getItemProps = null

    if (item && item.target) {
      normalized = normalizeItem(item)
      itemProps = getNormalPropsForListItem(normalized)

      // TODO this could be better
      const decorator = listItemDecorators[item.type]
      if (decorator) {
        if (typeof decorator === 'function') {
          ItemView = decorator.View
        } else {
          getItemProps = decorator.getItemProps
        }
      }
    }

    const icon =
      props.icon || (item ? item.appIdentifier : null) || (normalized ? normalized.icon : null)

    const getIsSelected = useCallback((index: number) => {
      if (appStore && appStore.isActive == false) {
        return undefined
      }
      if (props.isSelected) {
        return props.isSelected
      }
      if (selectableStore) {
        return selectableStore.isActiveIndex(index)
      }
      return false
    }, [])

    const showPeople = !!(!hidePeople && people && people.length && people[0].data['profile'])

    return (
      <UIListItem
        searchTerm={props.query}
        subtitleSpaceBetween={spaceBetween}
        {...itemProps}
        isSelected={getIsSelected}
        {...props}
        icon={icon}
        date={normalized ? normalized.updatedAt || normalized.createdAt : props.date}
        location={normalized ? normalized.location : props.location}
        {...getItemProps && getItemProps(item)}
      >
        {!!ItemView && <ItemView item={item} normalizedItem={normalized} {...itemViewProps} />}
        {showPeople && (
          <Bottom>
            <PersonRow people={people} />
          </Bottom>
        )}
      </UIListItem>
    )
  },
)

const Bottom = gloss({
  flexFlow: 'row',
  alignItems: 'center',
})

const spaceBetween = <div style={{ flex: 1 }} />

export const getNormalPropsForListItem = (normalized: NormalItem): OrbitListItemProps => ({
  title: normalized.title,
  location: normalized.location,
  // webLink: normalized.webLink,
  // desktopLink: normalized.desktopLink,
  // source: normalized.source,
  people: normalized.people,
  date: normalized.updatedAt,
  icon: normalized.icon,
  preview: normalized.preview,
  after: normalized.after,
})
