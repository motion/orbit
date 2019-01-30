import { AppType } from '@mcro/models'
import { App } from '@mcro/stores'
import { Popover, View } from '@mcro/ui'
import { flatten, memoize } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { DateRangePicker } from 'react-date-range'
import OrbitFilterIntegrationButton from '../../components/OrbitFilterIntegrationButton'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { preventDefault } from '../../helpers/preventDefault'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { FloatingBarButtonSmall } from '../../views/FloatingBar/FloatingBarButtonSmall'
import { Icon } from '../../views/Icon'
import ListItem from '../../views/ListItems/ListItem'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'
import './calendar.css' // theme css file
import OrbitSuggestionBar from './views/OrbitSuggestionBar'

const ItemActionDropdown = React.memo(function ItemActionDropdown() {
  console.log('render item action dropdown')
  const listApps = useActiveApps('lists')
  return (
    <>
      {flatten(
        listApps.map(app => {
          let items = [
            {
              id: `app-${app.id}`,
              title: app.name,
              icon: `orbit-${app.type}`,
              subtitle: `Parent list...`,
            },
          ]
          console.log('app.data.items', app.data.items)
          for (const id in app.data.items) {
            const folder = app.data.items[id]
            if (folder.type === 'folder') {
              items.push({
                id: `folder-${folder.id}`,
                title: folder.name,
                icon: folder.icon,
                subtitle: null,
              })
            }
          }
          return items.map(({ id, ...item }) => <ListItem key={id} {...item} />)
        }),
      )}
    </>
  )
})

export default observer(function SearchAppIndex(props: AppProps<AppType.search>) {
  const { searchStore, queryStore } = useStoresSafe()
  const { queryFilters } = queryStore
  const items = searchStore.searchState.results

  const getItemProps = React.useCallback(
    memoize(index => {
      const item = items[index]
      if (item.item && item.item.target) {
        return {
          after: (
            <Popover
              // selected would otherwise override this theme
              theme={App.state.darkTheme ? 'dark' : 'light'}
              width={250}
              height={300}
              target={
                <View
                  alignItems="center"
                  justifyContent="center"
                  width={34}
                  opacity={0.5}
                  hoverStyle={{ opacity: 1 }}
                  onClick={preventDefault(() => console.log('show popover'))}
                >
                  <Icon name="dots" size={12} />
                </View>
              }
              openOnClick
              closeOnClickAway
              group="filters"
              background
              borderRadius={10}
              elevation={2}
            >
              {isShown => isShown && <ItemActionDropdown />}
            </Popover>
          ),
        }
      }
      return null
    }),
    [items.map(i => `${i.id}${i.title}`).join(' ')],
  )

  return (
    <>
      <OrbitToolbar
        before={
          <>
            <Popover
              delay={250}
              openOnClick
              openOnHover
              closeOnClickAway
              group="filters"
              target={<FloatingBarButtonSmall icon="ui-1_calendar-57" />}
              background
              borderRadius={10}
              elevation={4}
              theme="light"
              width={390}
              height={300}
            >
              <View flex={1} className="calendar-dom theme-light" padding={10}>
                <DateRangePicker
                  onChange={queryFilters.onChangeDate}
                  ranges={[queryFilters.dateState]}
                />
              </View>
            </Popover>
            <View width={8} />
            <FloatingBarButtonSmall onClick={queryFilters.toggleSortBy} tooltip="Sort by">
              {queryFilters.sortBy}
            </FloatingBarButtonSmall>
            <View width={8} />
            <OrbitFilterIntegrationButton />
          </>
        }
        after={<OrbitSuggestionBar />}
      />

      <SelectableList
        minSelected={0}
        items={items}
        query={props.appStore.activeQuery}
        rowCount={searchStore.remoteRowCount}
        loadMoreRows={searchStore.loadMore}
        getItemProps={getItemProps}
      />
    </>
  )
})
