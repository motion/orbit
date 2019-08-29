import { isDefined } from '@o/utils'
import { Box, gloss, Theme } from 'gloss'
import React, { useCallback, useRef, useState } from 'react'

import { useDraggable } from '../Draggable'
import { ProvideFocus } from '../Focus'
import { Bit } from '../helpers/BitLike'
import { composeRefs } from '../helpers/composeRefs'
import { Config, CustomItemView } from '../helpers/configureUI'
import { NormalItem, normalizeItem } from '../helpers/normalizeItem'
import { PersonRow } from '../PersonRow'
import { useVisibilityStore } from '../Visibility'
import { ListItemSimple, ListItemSimpleProps } from './ListItemSimple'
import { ListItemViewProps } from './ListItemViewProps'
import { SelectableStore, useSelectableStore } from './SelectableStore'
import { VirtualListItemProps } from './VirtualListItem'

export type ListItemProps = ListItemSimpleProps &
  Omit<VirtualListItemProps<Bit>, 'index'> & {
    /** Internally used for selection, can be overridden */
    index?: number

    /** Attach an ID for index view selection, see AppViewProps */
    id?: string

    /** Attach an identifier for index view selection, see AppViewProps */
    identifier?: string

    /** Attach a subType for index view selection, see AppViewProps */
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

    /** Allow dragging to other targets */
    draggable?: boolean

    /** Specify the item you are dragging */
    draggableItem?: any

    /** Show the full content of the bit, if given, inline */
    showFullContent?: boolean
  }

export const ListItem = (props: ListItemProps) => {
  const {
    item,
    itemViewProps,
    people,
    hidePeople,
    alt,
    draggable,
    showFullContent,
    nodeRef,
    ...rest
  } = props
  const selectableStore = useSelectableStore()
  const visStore = useVisibilityStore()
  const [isEditing, setIsEditing] = useState(false)
  const listItemRef = useRef<HTMLElement | null>(null)

  useDraggable({
    ref: listItemRef,
    delay: 1000,
    item: props.draggableItem || props.item || props.extraData || props,
    enabled: draggable,
  })

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

  const icon = props.icon || (normalized ? normalized.icon : null)

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
  const showChildren = (showFullContent && isBit && ItemView) || showPeople
  const childrenProps = showChildren && {
    children: (
      <>
        {showFullContent && <ItemView item={item} normalizedItem={normalized} {...itemViewProps} />}
        {showPeople && (
          <Bottom>
            <PersonRow people={people} />
          </Bottom>
        )}
      </>
    ),
  }

  const onStartEditCb = useCallback(() => {
    // switch from selected to selectedInactive while editing
    setIsEditing(true)
    if (rest.onStartEdit) {
      rest.onStartEdit()
    }
  }, [rest.onStartEdit])

  const onEditCb = useCallback(
    a => {
      setIsEditing(false)
      if (rest.onEdit) {
        rest.onEdit(a)
      }
    },
    [rest.onEdit],
  )

  const onCancelEditCb = useCallback(
    a => {
      setIsEditing(false)
      if (rest.onCancelEdit) {
        rest.onCancelEdit(a)
      }
    },
    [rest.onCancelEdit],
  )

  return (
    // this focused={} conditional may look weird. it's because we want to disable the focus state while editing
    // so we look for edit, then turn off focus. `undefined` means "defer to parent value", so we are just ignoring
    <ProvideFocus focused={isEditing === true ? false : undefined}>
      <Theme alt={alt}>
        <ListItemSimple
          ref={composeRefs(listItemRef, nodeRef)}
          {...itemProps}
          {...rest}
          onStartEdit={onStartEditCb}
          onEdit={onEditCb}
          onCancelEdit={onCancelEditCb}
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
    </ProvideFocus>
  )
}

const Bottom = gloss(Box, {
  flexFlow: 'row',
  alignItems: 'center',
})

export const getNormalPropsForListItem = (normalized: NormalItem): ListItemProps => ({
  title: normalized.title,
  subTitle: normalized.subTitle,
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
