import { react } from '@mcro/black'
import { loadMany, loadOne, observeOne, save } from '@mcro/model-bridge'
import {
  AppModel,
  AppType,
  BitModel,
  ListAppDataItem,
  ListAppDataItemFolder,
  ListsApp,
  PersonBitModel,
  SearchResultModel,
} from '@mcro/models'
import {
  Absolute,
  Breadcrumbs,
  Button,
  ButtonProps,
  Input,
  Panel,
  PassProps,
  Row,
  Text,
  useBreadcrumb,
  View,
} from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { dropRight, flow, last } from 'lodash'
import { observer } from 'mobx-react-lite'
import pluralize from 'pluralize'
import * as React from 'react'
import { arrayMove } from 'react-sortable-hoc'
import { lists } from '.'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { getTargetValue } from '../../helpers/getTargetValue'
import { preventDefault } from '../../helpers/preventDefault'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { searchGroupsToResults } from '../../stores/SearchStore'
import { BorderBottom } from '../../views/Border'
import { FloatingBarButtonSmall } from '../../views/FloatingBar/FloatingBarButtonSmall'
import { Icon } from '../../views/Icon'
import { OrbitListItemProps } from '../../views/ListItems/OrbitListItem'
import SelectableList from '../../views/Lists/SelectableList'
import SelectableTreeList from '../../views/Lists/SelectableTreeList'
import { AppProps } from '../AppProps'

class ListStore {
  props: AppProps<AppType.lists>
  stores = useHook(useStoresSafe)

  query = ''
  selectedIndex = 0
  depth = 0
  history = [0]
  appRaw = react(() => +this.props.id, id => observeOne(AppModel, { args: { where: { id } } }))
  searchCollapsed = true

  setSearchCollapsedOnQuery = react(
    () => !!this.query,
    hasQuery => {
      this.searchCollapsed = !hasQuery
    },
  )

  toggleSearchCollapsed = () => {
    this.setSearchCollapsed(!this.searchCollapsed)
  }

  setSearchCollapsed = val => {
    console.log('setting to ', val)
    this.searchCollapsed = val
  }

  get app() {
    return this.appRaw as ListsApp
  }

  get parentId() {
    return last(this.history)
  }

  get currentFolder() {
    if (!this.app) {
      return null
    }
    return this.app.data.items[this.parentId] as ListAppDataItemFolder
  }

  get selectedItem() {
    if (!this.currentFolder) {
      return null
    }
    const id = this.currentFolder.children[this.selectedIndex]
    return this.items[id]
  }

  get items() {
    return (this.app && this.app.data.items) || {}
  }

  searchResults = react(
    () => [this.query, this.stores.spaceStore.activeSpace && this.stores.spaceStore.activeSpace.id],
    async ([query, spaceId], { sleep }) => {
      if (!query) {
        return null
      }
      // make searchresults lower priority than filtered
      await sleep(80)
      const results = await loadMany(SearchResultModel, {
        args: {
          spaceId,
          query,
          take: 20,
        },
      })
      return searchGroupsToResults(results).map(item => ({
        ...item,
        after: <Button margin={['auto', 0, 'auto', 10]} icon="add" />,
      }))
    },
  )

  setQuery = val => {
    this.query = val
  }

  back = () => {
    this.depth--
    this.history = dropRight(this.history)
  }
}

export const ListsAppIndex = observer(function ListsAppIndex(props: AppProps<AppType.lists>) {
  const store = useStore(ListStore, props)
  const numItems = Object.keys(store.items).length

  console.log('store.selectedItem', store.selectedItem)

  return (
    <>
      <OrbitToolbar
        before={
          <>
            {store.depth > 0 && (
              <FloatingBarButtonSmall icon="arrows-1_bold-left" onClick={store.back}>
                Back
              </FloatingBarButtonSmall>
            )}
          </>
        }
        center={
          <ListAppBreadcrumbs
            items={[
              {
                id: 0,
                name: <Icon name="home" size={12} opacity={0.5} />,
              },
              ...store.history
                .slice(1)
                .filter(Boolean)
                .map(id => store.items[id]),
              store.selectedItem,
            ].filter(Boolean)}
          />
        }
        after={`${numItems} ${pluralize('item', numItems)}`}
      />

      {/* Search/add bar */}
      <ListAdd store={store} />

      {/* List items */}
      <ListCurrentFolder store={store} />

      {/* Search results */}
      <ListSearchResults store={store} />
    </>
  )
})

export async function loadListItem(
  item?: ListAppDataItem,
  listId?: number,
): Promise<OrbitListItemProps> {
  switch (item.type) {
    case 'folder':
      return {
        title: item.name,
        subtitle: `${item.children.length} items`,
        after: <Button circular chromeless size={0.9} icon="arrowright" />,
        appConfig: {
          id: `${listId || -1}`,
          subId: `${item.id}`,
          subType: 'folder',
        },
      }
    case 'bit':
      return {
        item: await loadOne(BitModel, { args: { where: { id: +item.id } } }),
      }
    case 'person':
      return {
        item: await loadOne(PersonBitModel, { args: { where: { id: +item.id } } }),
      }
  }
  return null
}

const ListCurrentFolder = observer(function ListCurrentFolder(props: { store: ListStore }) {
  const { store } = props
  const { items, currentFolder } = store

  const getContextMenu = React.useCallback(index => {
    return [
      {
        label: 'Delete',
        click: () => {
          console.log('delete item', index)
        },
      },
    ]
  }, [])

  const onChangeDepth = React.useCallback((depth, history) => {
    store.depth = depth
    store.history = history
  }, [])

  const loadItemProps = React.useCallback((item: ListAppDataItem) => {
    return loadListItem(item, +store.props.id)
  }, [])

  const handleSortEnd = React.useCallback(
    ({ oldIndex, newIndex }) => {
      const children = arrayMove(currentFolder.children, oldIndex, newIndex)
      console.log('updating sort for list folder', currentFolder, children)
      store.app.data.items = {
        ...store.app.data.items,
        [currentFolder.id]: {
          ...currentFolder,
          children,
        },
      }
      save(AppModel, store.app)
    },
    [JSON.stringify(currentFolder)],
  )

  const handleSelect = React.useCallback(index => {
    store.selectedIndex = index
  }, [])

  return (
    <SelectableTreeList
      key={100}
      minSelected={0}
      rootItemID={0}
      items={items}
      loadItemProps={loadItemProps}
      sortable
      onSortEnd={handleSortEnd}
      getContextMenu={getContextMenu}
      onSelect={handleSelect}
      onChangeDepth={onChangeDepth}
      depth={store.depth}
    />
  )
})

const addFolder = (store: ListStore) => {
  lists.actions.receive(store.app, store.parentId, {
    target: 'folder',
    name: store.query,
  })
  store.setQuery('')
}

const ListAdd = observer(function ListAdd({ store }: { store: ListStore }) {
  return (
    <Row position="relative">
      <BorderBottom opacity={0.5} />
      <Input
        chromeless
        sizeRadius={0}
        paddingLeft={12}
        paddingRight={40}
        height={35}
        value={store.query}
        onChange={flow(
          preventDefault,
          getTargetValue,
          store.setQuery,
        )}
        onEnter={() => addFolder(store)}
        flex={1}
        placeholder="Add..."
      />
      <Absolute top={0} right={12} bottom={0}>
        <Row flex={1} alignItems="center">
          <PassProps chromeless opacity={0.35} hoverOpacity={1}>
            <Button
              active={!store.searchCollapsed}
              tooltip="Search to add"
              icon="zoom"
              onClick={store.toggleSearchCollapsed}
            />
            <Button tooltip="Create folder" icon="folder-15" onClick={() => addFolder(store)} />
          </PassProps>
        </Row>
      </Absolute>
    </Row>
  )
})

function ListCrumb(props: ButtonProps) {
  const { isLast } = useBreadcrumb()
  return (
    <>
      <FloatingBarButtonSmall chromeless {...props} />
      {!isLast ? (
        <Text size={1.5} fontWeight={900} alpha={0.5} margin={[0, 5]} height={4} lineHeight={0}>
          {' · '}
        </Text>
      ) : null}
    </>
  )
}

function ListAppBreadcrumbs(props: { items: { id: any; name: React.ReactNode }[] }) {
  return (
    <View flex={1}>
      <Breadcrumbs>
        {props.items.map((item, index) => (
          <ListCrumb key={`${item.id}${index}`}>{item.name}</ListCrumb>
        ))}
      </Breadcrumbs>
    </View>
  )
}

const ListSearchResults = observer(function ListSearchResults({ store }: { store: ListStore }) {
  const { searchCollapsed, searchResults, query } = store

  return (
    <Panel
      boxShadow={[[0, 0, 10, [0, 0, 0, 0.1]]]}
      margin={[0, -10]}
      padding={[0, 10]}
      padded={false}
      collapsable
      collapsed={searchCollapsed}
      onCollapse={store.setSearchCollapsed}
      heading={searchResults ? `Search Results (${searchResults.length})` : 'Search Results'}
    >
      <SelectableList query={query} items={searchResults || []} />
    </Panel>
  )
})
