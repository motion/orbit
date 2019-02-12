import { save } from '../../mediator'
import { AppModel } from '@mcro/models'
import { Absolute, Button, Input, Panel, PassProps, Row } from '@mcro/ui'
import { flow } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { arrayMove } from 'react-sortable-hoc'
import { getTargetValue } from '../../helpers/getTargetValue'
import { preventDefault } from '../../helpers/preventDefault'
import { BorderBottom } from '../../views/Border'
import SelectableList from '../../views/Lists/SelectableList'
import SelectableTreeList from '../../views/Lists/SelectableTreeList'
import { loadListItem } from './helpers'
import { ListAppProps, ListsApp } from './ListsApp'
import { ListStore } from './ListStore'
import { ListAppDataItem } from './types'

export default observer(function ListsAppIndex({ store }: ListAppProps) {
  return (
    <>
      {/* Search/add bar */}
      <ListAdd store={store} />

      {/* List items */}
      <ListCurrentFolder store={store} />

      {/* Search results */}
      <ListSearchResults store={store} />
    </>
  )
})

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
  ListsApp.api.receive(store.app, store.parentId, {
    target: 'folder',
    name: store.query,
  })
  store.setQuery('')
}

const ListAdd = observer(function ListAdd({ store }: { store: ListStore }) {
  return (
    <Row position="relative">
      <BorderBottom opacity={0.25} />
      <Input
        chromeless
        sizeRadius={0}
        paddingLeft={12}
        paddingRight={40}
        height={33}
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
