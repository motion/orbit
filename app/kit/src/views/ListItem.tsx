import { gloss } from '@o/gloss'
import { Bit } from '@o/models'
import {
  ListItem as UIListItem,
  ListItemProps,
  PersonRow,
  SelectableStore,
  VirtualListItemProps,
} from '@o/ui'
import React, { forwardRef, useCallback } from 'react'
import { BitGenericItem } from '../bit/BitGenericItem'
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

export const ListItem = forwardRef((props: OrbitListItemProps, ref) => {
  const { item, itemViewProps, people, hidePeople, selectableStore, ...rest } = props
  const { appStore } = useStoresSimple()

  // this is the view from sources, each bit type can have its own display
  let ItemView: ListItemComponent = null
  let itemProps: Partial<ListItemProps> = null
  let normalized: NormalItem = null
  let getItemProps = null
  const isBit = !!(item && item.target)

  if (isBit) {
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
  const showChildren = isBit || showPeople
  const childrenProps = showChildren && {
    children: (
      <>
        {!!ItemView && <ItemView item={item} normalizedItem={normalized} {...itemViewProps} />}
        {/* if syncer doesn't sync any content type, we can still show a generic preview */}
        {isBit && !ItemView && (
          <BitGenericItem item={item} normalizedItem={normalized} {...itemViewProps} />
        )}
        {showPeople && (
          <Bottom>
            <PersonRow people={people} />
          </Bottom>
        )}
      </>
    ),
  }

  return (
    <UIListItem
      ref={ref}
      searchTerm={props.query}
      {...itemProps}
      {...rest}
      icon={icon}
      date={normalized ? normalized.updatedAt || normalized.createdAt : props.date}
      location={normalized ? normalized.location : props.location}
      {...getItemProps && getItemProps(item)}
      isSelected={getIsSelected}
      // dont put children unless you actually have children,
      // otherwise you trip up some spacing stuff in ListItem
      {...childrenProps}
    />
  )
})

const Bottom = gloss({
  flexFlow: 'row',
  alignItems: 'center',
})

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
