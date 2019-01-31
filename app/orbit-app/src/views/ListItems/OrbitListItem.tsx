import { gloss } from '@mcro/gloss'
import { Bit, PersonBit } from '@mcro/models'
import * as React from 'react'
import PeopleRow from '../../components/PeopleRow'
import { NormalItem, normalizeItem } from '../../helpers/normalizeItem'
import { Omit } from '../../helpers/typeHelpers/omit'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { OrbitItemViewProps } from '../../sources/types'
import { renderHighlightedText } from '../VirtualList/renderHighlightedText'
import { VirtualListItemProps } from '../VirtualList/VirtualListItem'
import ListItem, { ListItemProps } from './ListItem'
import ListItemPerson from './ListItemPerson'

type OrbitItem = Bit | PersonBit | any

export type OrbitListItemProps = Omit<VirtualListItemProps<OrbitItem>, 'index'> & {
  hidePeople?: boolean
  itemViewProps?: OrbitItemViewProps<any>
}

export const OrbitListItem = React.memo(
  ({ item, itemViewProps, people, hidePeople, ...props }: OrbitListItemProps) => {
    const { appStore, selectionStore, sourcesStore } = useStoresSafe({
      optional: ['selectionStore'],
    })

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

    const showPeople = !!(!hidePeople && people && people.length && people[0].data['profile'])

    return (
      <ListItem
        searchTerm={props.query}
        subtitleSpaceBetween={spaceBetween}
        {...ItemView && ItemView.itemProps}
        {...itemProps}
        isSelected={isSelected}
        {...props}
        icon={icon}
      >
        {!!ItemView && (
          <ItemView
            item={item}
            shownLimit={3}
            renderText={renderHighlightedText}
            // extraProps={extraProps}
            normalizedItem={normalized}
            {...ItemView.itemProps}
            {...itemViewProps}
          />
        )}
        {showPeople && (
          <Bottom>
            <PeopleRow people={people} />
          </Bottom>
        )}
      </ListItem>
    )
  },
)

const Bottom = gloss({
  flexFlow: 'row',
  alignItems: 'center',
})

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
