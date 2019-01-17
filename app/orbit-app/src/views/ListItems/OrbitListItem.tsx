import * as React from 'react'
import VirtualListItem, { VirtualListItemProps } from '../VirtualList/VirtualListItem'
import { normalizeItem, NormalItem } from '../../helpers/normalizeItem'
import { renderHighlightedText } from '../VirtualList/renderHighlightedText'
import { ListItemPerson } from './ListItemPerson'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { ListItemProps } from './ListItem'
import { PersonBit, Bit } from '@mcro/models'
import { OrbitHandleSelect } from '../Lists/OrbitList'

export type OrbitListItemProps = VirtualListItemProps<Bit | PersonBit> & {
  onSelect?: OrbitHandleSelect
  onOpen?: OrbitHandleSelect
}

export const OrbitListItem = React.memo((props: OrbitListItemProps) => {
  const { appStore, selectionStore, sourcesStore } = useStoresSafe({ optional: ['selectionStore'] })

  // this is the view from sources, each bit type can have its own display
  let ItemView = null
  let itemProps: Partial<ListItemProps> = null
  let normalized: NormalItem = null

  if (props.item && props.item.target) {
    switch (props.item.target) {
      case 'bit':
      case 'person-bit':
        normalized = normalizeItem(props.item)
        itemProps = getNormalPropsForListItem(normalized)

        if (props.item.target === 'bit') {
          ItemView = sourcesStore.getView(normalized.integration, 'item')
        } else if (props.item.target === 'person-bit') {
          ItemView = ListItemPerson
        }
        break
      default:
        return <div>SearchResultListItem no result</div>
    }
  }

  return (
    <VirtualListItem
      index={props.realIndex}
      searchTerm={props.query}
      subtitleSpaceBetween={spaceBetween}
      {...ItemView && ItemView.itemProps}
      {...itemProps}
      isSelected={index => {
        const appActive = appStore ? appStore.isActive : true
        const isSelected =
          props.isSelected || (selectionStore && selectionStore.activeIndex === index) || false
        return appActive && isSelected
      }}
      // allow props to override isSelected but not onSelect
      // onSelect merges
      {...props}
      onSelect={index => {
        if (selectionStore && selectionStore.activeIndex !== index) {
          selectionStore.toggleSelected(index)
        }
        if (props.onSelect) {
          props.onSelect(index, props.appConfig || (normalized && normalized.appConfig) || null)
        }
      }}
    >
      {!!ItemView && (
        <ItemView
          item={props.item}
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

// setHoverSettler = react(
//   () => this.props.hoverToSelect,
//   hoverSelect => {
//     ensure('hoverSelect', !!hoverSelect)
//     ensure('!hoverSettler', !this.hoverSettler)
//     this.hoverSettler = this.stores.appStore.getHoverSettler()
//     this.hoverSettler.setItem({
//       index: this.props.index,
//     })
//   },
// )
