import { AppProps, getTargetValue, List, useStores } from '@mcro/kit'
import {
  Absolute,
  BorderBottom,
  Button,
  Input,
  Panel,
  PassProps,
  preventDefault,
  Row,
  View,
} from '@mcro/ui'
import { flow } from 'lodash'
import React, { useContext } from 'react'
import { API, ListContext } from '.'
import { ListStore } from './ListStore'

export function ListsAppIndex(_: AppProps) {
  // const [state, updateState] = useAppState()
  // const [bits] = useBits({ where: {} })
  return (
    <>
      <ListAdd />

      <View flex={1}>
        {/* <TreeList
        sortable
        minSelected={0}
        rootItemID={0}
        items={app.data.items}
        getContextMenu={index => {
          return [
            {
              label: 'Delete',
              click: () => {
                console.log('delete item', index)
              },
            },
          ]
        }}
      /> */}
      </View>

      <ListSearchResults />
    </>
  )
}

const addFolder = (store: ListStore) => {
  API.receive(store.app, store.parentId, {
    target: 'folder',
    name: store.query,
  })
  store.setQuery('')
}

function ListAdd() {
  const { listStore } = useContext(ListContext)
  console.log('listStore, listStore', listStore)
  return null
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
        onEnter={() => {
          addFolder(listStore)
        }}
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
  return null

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
      <List query={query} items={searchResults || []} />
    </Panel>
  )
}
