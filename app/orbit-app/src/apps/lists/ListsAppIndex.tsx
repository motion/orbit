import { AppModel } from '@mcro/models'
import { Absolute, Button, Input, Panel, PassProps, Row } from '@mcro/ui'
import { flow } from 'lodash'
import React, { useCallback } from 'react'
import { arrayMove } from 'react-sortable-hoc'
import { getTargetValue } from '../../helpers/getTargetValue'
import { preventDefault } from '../../helpers/preventDefault'
import { useStores } from '../../hooks/useStores'
import { save } from '../../mediator'
import { BorderBottom } from '../../views/Border'
import SelectableList from '../../views/Lists/SelectableList'
import SelectableTreeList from '../../views/Lists/SelectableTreeList'
import { AppProps } from '../AppTypes'
import { loadListItem } from './helpers'
import { ListsApp } from './ListsApp'
import { ListStore } from './ListStore'
import { ListAppDataItem } from './types'

export function ListsAppIndex(_: AppProps) {
  return (
    <>
      {/* Search/add bar */}
      <ListAdd />
      {/* List items */}
      <ListCurrentFolder />
      {/* Search results */}
      <ListSearchResults />
    </>
  )
}

function ListCurrentFolder() {
  const { listStore } = useStores()
  const { items, currentFolder } = listStore
  console.log('rendering with', items)

  const getContextMenu = useCallback(index => {
    return [
      {
        label: 'Delete',
        click: () => {
          console.log('delete item', index)
        },
      },
    ]
  }, [])
  const onChangeDepth = useCallback((depth, history) => {
    listStore.depth = depth
    listStore.history = history
  }, [])

  const loadItemProps = useCallback((item: ListAppDataItem) => {
    return loadListItem(item, +listStore.props.id)
  }, [])

  const handleSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      const children = arrayMove(currentFolder.children, oldIndex, newIndex)
      listStore.app.data.items = {
        ...listStore.app.data.items,
        [currentFolder.id]: {
          ...currentFolder,
          children,
        },
      }
      save(AppModel, listStore.app)
    },
    [JSON.stringify(currentFolder)],
  )

  const handleSelect = useCallback(index => {
    listStore.selectedIndex = index
  }, [])

  return (
    <SelectableTreeList
      minSelected={0}
      rootItemID={0}
      items={items}
      loadItemProps={loadItemProps}
      sortable
      onSortEnd={handleSortEnd}
      getContextMenu={getContextMenu}
      onSelect={handleSelect}
      onChangeDepth={onChangeDepth}
      depth={listStore.depth}
    />
  )
}

const addFolder = (store: ListStore) => {
  ListsApp.api.receive(store.app, store.parentId, {
    target: 'folder',
    name: store.query,
  })
  store.setQuery('')
}

function ListAdd() {
  const { listStore } = useStores()
  return (
    <Row position="relative">
      <BorderBottom opacity={0.25} />
      <Input
        chromeless
        sizeRadius={0}
        paddingLeft={12}
        paddingRight={40}
        height={33}
        value={listStore.query}
        onChange={flow(
          preventDefault,
          getTargetValue,
          listStore.setQuery,
        )}
        onEnter={() => addFolder(listStore)}
        flex={1}
        placeholder="Add..."
      />
      <Absolute top={0} right={12} bottom={0}>
        <Row flex={1} alignItems="center">
          <PassProps chromeless opacity={0.35} hoverOpacity={1}>
            <Button
              active={!listStore.searchCollapsed}
              tooltip="Search to add"
              icon="zoom"
              onClick={listStore.toggleSearchCollapsed}
            />
            <Button tooltip="Create folder" icon="folder-15" onClick={() => addFolder(listStore)} />
          </PassProps>
        </Row>
      </Absolute>
    </Row>
  )
}

function ListSearchResults() {
  // @ts-ignore
  const { listStore } = useStores()
  const { searchCollapsed, searchResults, query } = listStore

  return (
    <Panel
      boxShadow={[[0, 0, 10, [0, 0, 0, 0.1]]]}
      margin={[0, -10]}
      padding={[0, 10]}
      padded={false}
      collapsable
      collapsed={searchCollapsed}
      onCollapse={listStore.setSearchCollapsed}
      heading={searchResults ? `Search Results (${searchResults.length})` : 'Search Results'}
    >
      <SelectableList query={query} items={searchResults || []} />
    </Panel>
  )
}
