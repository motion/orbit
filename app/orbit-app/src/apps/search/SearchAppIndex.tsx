import { AppType, Bit } from '@mcro/models'
import { App } from '@mcro/stores'
import { Popover, View } from '@mcro/ui'
import { flatten, flow, memoize } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { preventDefault } from '../../helpers/preventDefault'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { FloatingBarButton } from '../../views/FloatingBar/FloatingBarButton'
import { Icon } from '../../views/Icon'
import ListItem from '../../views/ListItems/ListItem'
import { OrbitListItemProps } from '../../views/ListItems/OrbitListItem'
import SelectableList from '../../views/Lists/SelectableList'
import { MergeContext } from '../../views/MergeContext'
import { Separator } from '../../views/Separator'
import { AppProps } from '../AppTypes'
import { listRootID, lists } from '../lists/ListsApp'
import './calendar.css' // theme css file
import OrbitSuggestionBar from './views/OrbitSuggestionBar'

const ItemActionContext = React.createContext<{ item: Bit }>({ item: null })

const ItemActionDropdown = React.memo(function ItemActionDropdown() {
  const itemAction = React.useContext(ItemActionContext)
  const listApps = useActiveApps(AppType.lists)

  return (
    <View overflowX="hidden" overflowY="auto" flex={1}>
      <Separator paddingTop={10}>Send to...</Separator>
      {flatten(
        listApps.map(app => {
          let items: OrbitListItemProps[] = [
            {
              id: `app-${app.id}`,
              title: app.name,
              icon: `orbit-${app.type}`,
              subtitle: `Parent list...`,
              onClick: () => {
                console.log('sending to list', app, itemAction.item)
                lists.actions.receive(app, listRootID, itemAction.item)
              },
            },
          ]
          for (const id in app.data.items) {
            const folder = app.data.items[id]
            if (folder.type === 'folder') {
              items.push({
                id: `folder-${folder.id}`,
                title: folder.name,
                icon: folder.icon || 'folder',
                subtitle: null,
                marginLeft: 10,
              })
            }
          }
          return items.map(({ id, ...item }) => <ListItem key={id} {...item} />)
        }),
      )}
    </View>
  )
})

export default observer(function SearchAppIndex(props: AppProps) {
  const { searchStore, queryStore } = useStoresSafe()
  const { queryFilters } = queryStore
  const items = searchStore.searchState.results

  const getItemProps = React.useCallback(
    memoize(({ item }) => {
      if (item && item.target === 'bit') {
        return {
          after: (
            <MergeContext Context={ItemActionContext} value={{ item }}>
              <Popover
                towards="right"
                // selected would otherwise override this theme
                themeName={App.state.isDark ? 'light' : 'dark'}
                distance={5}
                width={250}
                height={300}
                target={
                  <View
                    alignItems="center"
                    justifyContent="center"
                    width={34}
                    opacity={0.5}
                    hoverStyle={{ opacity: 1 }}
                    onClick={flow(
                      preventDefault,
                      () => console.log('show popover'),
                    )}
                  >
                    <Icon name="dots" size={12} />
                  </View>
                }
                openOnClick
                closeOnClickAway
                group="filters"
                background
                borderRadius={10}
                elevation={1}
              >
                {isShown => isShown && <ItemActionDropdown />}
              </Popover>
            </MergeContext>
          ),
        }
      }
      return null
    }),
    [items.map(i => `${i.id}`).join(' ')],
  )

  return (
    <>
      <OrbitToolbar
        before={
          <FloatingBarButton
            onClick={queryFilters.toggleSortBy}
            tooltip={`Sort by: ${queryFilters.sortBy}`}
            icon={queryFilters.sortBy === 'Relevant' ? 'shape-circle' : 'arrowup'}
          />
        }
        center={<OrbitSuggestionBar />}
      />
      <SelectableList
        minSelected={0}
        items={items}
        query={props.appStore.activeQuery}
        getItemProps={getItemProps}
      />
    </>
  )
})
