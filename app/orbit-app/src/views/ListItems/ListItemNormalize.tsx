import * as React from 'react'
import { OrbitListItem } from './OrbitListItem'
import { ListItemProps } from '../VirtualList/VirtualListItem'
import { normalizeItem } from '../../helpers/normalizeItem'
import { renderHighlightedText } from '../VirtualList/renderHighlightedText'
import { ListItemPerson } from './ListItemPerson'
import { useStoresSafe } from '../../hooks/useStoresSafe'

const spaceBetween = <div style={{ flex: 1 }} />

export const getNormalPropsForListItem = (normalized: any) => ({
  title: normalized.title,
  location: normalized.location,
  webLink: normalized.webLink,
  desktopLink: normalized.desktopLink,
  updatedAt: normalized.updatedAt,
  integration: normalized.integration,
  icon: normalized.icon,
  people: normalized.people,
  preview: normalized.preview,
  children: normalized.children,
  before: normalized.before,
  after: normalized.after,
})

export const ListItemNormalize = (props: ListItemProps) => {
  const { sourcesStore } = useStoresSafe()
  const normalized = normalizeItem(props.item as any)
  const ItemView =
    props.item.target === 'bit'
      ? sourcesStore.getView(normalized.integration, 'item')
      : ListItemPerson
  return (
    <OrbitListItem
      index={props.realIndex}
      searchTerm={props.query}
      subtitleSpaceBetween={spaceBetween}
      {...ItemView.itemProps}
      {...getNormalPropsForListItem(normalized)}
      {...props}
    >
      <ItemView
        item={props.item}
        bit={props.item}
        shownLimit={10}
        renderText={renderHighlightedText}
        extraProps={{
          condensed: true,
          preventSelect: true,
        }}
        normalizedItem={normalized}
        {...ItemView.itemProps}
      />
    </OrbitListItem>
  )
}
