import * as React from 'react'
import { ListItem } from '../VirtualList/VirtualListItem'
import { OrbitListItem } from './OrbitListItem'
import { normalizeItem, NormalItem } from '../../helpers/normalizeItem'
import { renderHighlightedText } from '../VirtualList/renderHighlightedText'
import { ListItemPerson } from './ListItemPerson'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { OrbitItemProps } from './OrbitItemProps'

export const SearchResultListItem = (props: any) => {
  const { sourcesStore } = useStoresSafe()

  return React.useMemo(
    () => {
      console.log('waht?')
      const { item } = props
      if (item && item.target) {
        switch (item.target) {
          case 'bit':
          case 'person-bit':
            const normalized = normalizeItem(item)
            let ItemView = null
            if (item.target === 'bit') {
              ItemView = sourcesStore.getView(normalized.integration, 'item')
            } else if (item.target === 'person-bit') {
              ItemView = ListItemPerson
            }
            return (
              <OrbitListItem
                index={props.realIndex}
                searchTerm={props.query}
                subtitleSpaceBetween={spaceBetween}
                {...ItemView.itemProps}
                {...getNormalPropsForListItem(normalized)}
                {...props}
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
          default:
            return <div>SearchResultListItem no result</div>
        }
      }
      return <ListItem {...props} />
    },
    [JSON.stringify(props)],
  )
}

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
