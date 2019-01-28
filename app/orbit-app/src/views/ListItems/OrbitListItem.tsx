import { Bit, PersonBit } from '@mcro/models'
import * as React from 'react'
import { NormalItem, normalizeItem } from '../../helpers/normalizeItem'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Icon } from '../Icon'
import { renderHighlightedText } from '../VirtualList/renderHighlightedText'
import VirtualListItem, { VirtualListItemProps } from '../VirtualList/VirtualListItem'
import { ListItemProps } from './ListItem'
import { ListItemPerson } from './ListItemPerson'

type OrbitItem = Bit | PersonBit | any

export type OrbitListItemProps = VirtualListItemProps<OrbitItem>

export const OrbitListItem = React.memo(({ item, ...props }: OrbitListItemProps) => {
  const { appStore, selectionStore, sourcesStore } = useStoresSafe({ optional: ['selectionStore'] })

  // this is the view from sources, each bit type can have its own display
  let ItemView = null
  let itemProps: Partial<ListItemProps> = null
  let normalized: NormalItem = null

  if (item && item.target) {
    switch (item.target) {
      case 'bit':
      case 'person-bit':
        normalized = normalizeItem(item)
        itemProps = getNormalPropsForListItem(normalized)

        if (item.target === 'bit') {
          ItemView = sourcesStore.getView(normalized.integration, 'item')
        } else if (item.target === 'person-bit') {
          ItemView = ListItemPerson
        }
        break
      default:
        return <div>SearchResultListItem no result</div>
    }
  }

  const icon = props.icon || (item ? item.icon : null) || (normalized ? normalized.icon : null)

  const isSelected = React.useCallback(index => {
    const appActive = appStore ? appStore.isActive : true
    const isSelected =
      props.isSelected || (selectionStore && selectionStore.activeIndex === index) || false
    return appActive && isSelected
  }, [])

  return (
    <VirtualListItem
      index={props.realIndex}
      searchTerm={props.query}
      subtitleSpaceBetween={spaceBetween}
      {...ItemView && ItemView.itemProps}
      {...itemProps}
      isSelected={isSelected}
      // allow props to override isSelected but not onSelect
      {...props}
      icon={icon ? <Icon name={icon} size={16} {...props.iconProps} /> : null}
    >
      {!!ItemView && (
        <ItemView
          item={item}
          shownLimit={3}
          renderText={renderHighlightedText}
          extraProps={extraProps}
          normalizedItem={normalized}
          {...ItemView.itemProps}
        />
      )}
    </VirtualListItem>
  )
})

const extraProps = {
  condensed: true,
  preventSelect: true,
}
const spaceBetween = <div style={{ flex: 1 }} />

export const getNormalPropsForListItem = (normalized: NormalItem): ListItemProps => ({
  title: normalized.title,
  location: normalized.location,
  webLink: normalized.webLink,
  desktopLink: normalized.desktopLink,
  updatedAt: normalized.updatedAt,
  integration: normalized.integration,
  icon: normalized.icon,
  people: normalized.people,
  preview: normalized.preview,
  after: normalized.after,
})
