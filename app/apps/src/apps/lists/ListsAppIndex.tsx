import { ensure, useReaction } from '@mcro/use-store'
import { getTargetValue, List, searchBits, TreeList, useTreeList } from '@o/kit'
import { Button, InputRow, Panel, preventDefault, useToggle, View } from '@o/ui'
import { flow } from 'lodash'
import React, { useState } from 'react'

export function ListsAppIndex() {
  const treeList = useTreeList('list')
  const [addQuery, setAddQuery] = useState('')
  const [showSearch, toggleShowSearch] = useToggle(false)

  const searchResults = useReaction(
    async (_, { sleep }) => {
      ensure('query', !!addQuery)
      await sleep(100)
      const results = await searchBits({ query: addQuery, take: 20 })
      return results.map(item => ({
        ...item,
        after: <Button margin={['auto', 0, 'auto', 10]} icon="add" />,
      }))
    },
    {
      defaultValue: [],
    },
    [addQuery],
  )

  return (
    <>
      <InputRow
        value={addQuery}
        onChange={flow(
          preventDefault,
          getTargetValue,
          setAddQuery,
        )}
        onEnter={() => treeList.actions.addFolder(addQuery)}
        placeholder="Add..."
        buttons={
          <>
            <Button
              active={showSearch}
              tooltip="Search to add"
              icon="zoom"
              onClick={toggleShowSearch}
            />
            <Button
              tooltip="Create folder"
              icon="folder-15"
              onClick={() => treeList.actions.addFolder(addQuery)}
            />
          </>
        }
      />
      <View flex={1}>
        <TreeList
          sortable
          minSelected={0}
          {...treeList.state}
          // actions={['delete']}
        />
      </View>

      <Panel
        boxShadow={[[0, 0, 10, [0, 0, 0, 0.1]]]}
        margin={[0, -10]}
        padding={[0, 10]}
        padded={false}
        collapsable
        collapsed={showSearch}
        onCollapse={toggleShowSearch}
        heading={searchResults ? `Search Results (${searchResults.length})` : 'Search Results'}
      >
        <List query={addQuery} items={searchResults || []} />
      </Panel>
    </>
  )
}

// const addFolder = (store: ListStore) => {
//   // API.receive(store.app, store.parentId, {
//   //   target: 'folder',
//   //   name: store.query,
//   // })
//   store.setQuery('')
// }

// for <TreeList />
// getContextMenu={index => {
//   return [
//     {
//       label: 'Delete',
//       click: () => {
//         console.log('delete item', index)
//       },
//     },
//   ]
// }}
