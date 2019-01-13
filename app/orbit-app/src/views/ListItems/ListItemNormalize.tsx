import * as React from 'react'
import { OrbitListItem } from './OrbitListItem'
import { ListItemProps } from '../VirtualList/VirtualListItem'
import { normalizeItem, NormalItem } from '../../helpers/normalizeItem'
import { renderHighlightedText } from '../VirtualList/renderHighlightedText'
import { ListItemPerson } from './ListItemPerson'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { OrbitItemProps } from './OrbitItemProps'

const spaceBetween = <div style={{ flex: 1 }} />

export const getNormalPropsForListItem = (normalized: NormalItem): OrbitItemProps<any> => ({
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

export const isEqualDeep = (a: Object, b: Object) => {
  const res = JSON.stringify(a) === JSON.stringify(b)
  console.log('isequal', a, b, res)
  return res
}

export const ListItemNormalize = React.memo(({ item, ...rest }: ListItemProps) => {
  console.log('render normalized...')
  const { sourcesStore } = useStoresSafe()
  const normalized = normalizeItem(item)
  let ItemView = null
  if (item.target === 'bit') {
    ItemView = sourcesStore.getView(normalized.integration, 'item')
  } else if (item.target === 'person-bit') {
    ItemView = ListItemPerson
  }
  return (
    <OrbitListItem
      index={rest.realIndex}
      searchTerm={rest.query}
      subtitleSpaceBetween={spaceBetween}
      {...ItemView.itemProps}
      {...getNormalPropsForListItem(normalized)}
      {...rest}
    >
      {!!ItemView && (
        <ItemView
          item={item}
          bit={item}
          shownLimit={10}
          renderText={renderHighlightedText}
          extraProps={{
            condensed: true,
            preventSelect: true,
          }}
          normalizedItem={normalized}
          {...ItemView.itemProps}
        />
      )}
    </OrbitListItem>
  )
}, isEqualDeep)
