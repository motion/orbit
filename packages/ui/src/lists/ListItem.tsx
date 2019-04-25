import { gloss, Theme } from '@o/gloss'
import { isDefined } from '@o/utils'
import React, { forwardRef, useCallback } from 'react'

import { Bit } from '../helpers/BitLike'
import { Config, CustomItemView } from '../helpers/configure'
import { NormalItem, normalizeItem } from '../helpers/normalizeItem'
import { PersonRow } from '../PersonRow'
import { Omit } from '../types'
import { useVisibilityStore } from '../Visibility'
import { ListItemBit } from './ListItemBit'
import { ListItemSimple, ListItemSimpleProps } from './ListItemSimple'
import { ListItemViewProps } from './ListItemViewProps'
import { SelectableStore, useSelectableStore } from './SelectableStore'
import { VirtualListItemProps } from './VirtualListItem'

export type ListItemProps = ListItemSimpleProps &
  Omit<VirtualListItemProps<Bit>, 'index'> & {
    /** Internally used for selection, can be overridden */
    index?: number

    /** Attach an ID for index view selection, see AppProps */
    id?: string

    /** Attach an identifier for index view selection, see AppProps */
    identifier?: string

    /** Attach a subType for index view selection, see AppProps */
    subType?: string

    /** Show a row of people below the list item */
    people?: Bit[]

    /** Disable automatically showing people when passing in a Bit */
    hidePeople?: boolean

    /** Props for the inner ItemView, when displaying a media item type */
    itemViewProps?: ListItemViewProps

    /** Pass in your own SelectableStore */
    selectableStore?: SelectableStore

    /** Arbitrarily add extra data, makes search and doing things on onSelect callbacks easier */
    extraData?: any
  }

export const ListItem = forwardRef((props: ListItemProps, ref) => {
  const { item, itemViewProps, people, hidePeople, ...rest } = props
  const selectableStore = useSelectableStore(props)
  const visStore = useVisibilityStore()

  // this is the view from sources, each bit type can have its own display
  let ItemView: CustomItemView = null
  let itemProps: Partial<ListItemSimpleProps> = null
  let normalized: NormalItem = null
  let getItemProps = null
  const isBit = !!(item && item.target)

  if (isBit && Config.customItems) {
    normalized = normalizeItem(item)
    itemProps = getNormalPropsForListItem(normalized)

    const decorator = Config.customItems[item.type]
    if (decorator) {
      ItemView = decorator.listItem
      getItemProps = decorator.getItemProps
    }
  }

  const icon =
    props.icon || (item ? item.appIdentifier : null) || (normalized ? normalized.icon : null)

  const getIsSelected = useCallback((index: number) => {
    if (visStore && visStore.visible === false) {
      return false
    }
    if (isDefined(props.isSelected)) {
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
          <ListItemBit item={item} normalizedItem={normalized} {...itemViewProps} />
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
    <Theme alt={props.alt}>
      <ListItemSimple
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
    </Theme>
  )
})

const Bottom = gloss({
  flexFlow: 'row',
  alignItems: 'center',
})

export const getNormalPropsForListItem = (normalized: NormalItem): ListItemProps => ({
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
