import * as React from 'react'
import { OrbitListItem } from './OrbitListItem'
import { ListItemProps } from '../VirtualList/VirtualListItem'
import { normalizeItem } from '../../helpers/normalizeItem'
import { renderHighlightedText } from '../VirtualList/renderHighlightedText'
import { StoreContext } from '@mcro/black'
import { ListItemPerson } from './ListItemPerson'

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
  const { sourcesStore } = React.useContext(StoreContext)
  const normalized = normalizeItem(props.model)
  const ItemView =
    props.model.target === 'bit'
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
        model={props.model}
        bit={props.model}
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
