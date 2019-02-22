import { gloss } from '@mcro/gloss'
import { Bit, Person, PersonBit } from '@mcro/models'
import { ListItem as UIListItem, ListItemProps, PersonRow, VirtualListItemProps } from '@mcro/ui'
import * as React from 'react'
import { normalizeItem } from '../helpers/normalizeItem'
import { useStoresSimple } from '../hooks/useStores'
import { Omit } from '../types'
import { AppConfig } from '../types/AppConfig'
import { ItemType } from '../types/ItemType'
import { NormalItem } from '../types/NormalItem'
import { OrbitItemViewProps } from '../types/OrbitItemViewProps'
import { ListItemPerson } from './ListItemPerson'

type OrbitItem = Bit | PersonBit | any

type OrbitItemComponent<A extends ItemType> = React.FunctionComponent<OrbitItemViewProps<A>> & {
  itemProps?: OrbitItemViewProps<A>
}

export type OrbitListItemProps = Omit<VirtualListItemProps<OrbitItem>, 'index'> & {
  index?: number
  // for appconfig merge
  id?: string
  type?: string
  subType?: string
  // extra props for orbit list items
  people?: Person[]
  hidePeople?: boolean
  itemViewProps?: OrbitItemViewProps<any>
  appConfig?: AppConfig
}

export const ListItem = React.memo(
  ({ item, itemViewProps, people, hidePeople, ...props }: OrbitListItemProps) => {
    // !TODO
    const { appStore, selectionStore, sourcesStore } = useStoresSimple()

    // this is the view from sources, each bit type can have its own display
    let ItemView: OrbitItemComponent<any> = null
    let itemProps: Partial<ListItemProps> = null
    let normalized: NormalItem = null

    if (item && item.target) {
      switch (item.target) {
        case 'bit':
        case 'person-bit':
          normalized = normalizeItem(item)
          itemProps = getNormalPropsForListItem(normalized)

          if (item.target === 'bit') {
            // !TODO instead of using sourcesStore directly, have configuration config.getItemView()
            ItemView = sourcesStore.getView(normalized.sourceType, 'item')
          } else if (item.target === 'person-bit') {
            ItemView = ListItemPerson
          }
          break
        default:
          return <div>SearchResultListItem no result</div>
      }
    }

    const icon = props.icon || (item ? item.icon : null) || (normalized ? normalized.icon : null)

    const isSelected = React.useCallback((index: number) => {
      const appActive = appStore ? appStore.isActive : true
      const isSelected =
        props.isSelected || (selectionStore && selectionStore.activeIndex === index) || false
      if (appActive) {
        return isSelected
      }
      return false
    }, []) as any

    const showPeople = !!(!hidePeople && people && people.length && people[0].data['profile'])

    return (
      <UIListItem
        searchTerm={props.query}
        subtitleSpaceBetween={spaceBetween}
        {...ItemView && ItemView.itemProps}
        {...itemProps}
        isSelected={isSelected}
        {...props}
        icon={icon}
        date={normalized ? normalized.updatedAt || normalized.createdAt : props.date}
        location={normalized ? normalized.location : props.location}
      >
        {!!ItemView && (
          <ItemView
            item={item}
            normalizedItem={normalized}
            {...ItemView.itemProps}
            {...itemViewProps}
          />
        )}
        {showPeople && (
          <Bottom>
            <PersonRow people={people} />
          </Bottom>
        )}
      </UIListItem>
    )
  },
)

const Bottom = gloss({
  flexFlow: 'row',
  alignItems: 'center',
})

const spaceBetween = <div style={{ flex: 1 }} />

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
