import {
  ensure,
  getTargetValue,
  List,
  searchBits,
  TreeList,
  useReaction,
  useTreeList,
} from '@o/kit'
import { Button, Panel, preventDefault, SearchableTopBar, useToggle, View } from '@o/ui'
import { flow } from 'lodash'
import React, { useState } from 'react'

export function ListsAppIndex() {
  const treeList = useTreeList('list')
  const [addQuery, setAddQuery] = useState('')
  const showSearch = useToggle(false)

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
      <SearchableTopBar
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
              active={showSearch.val}
              tooltip="Search to add"
              icon="zoom"
              onClick={showSearch.toggle}
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
          use={treeList}
          sortable
          // actions={['delete']}
        />
      </View>

      <Panel
        elevation={1}
        collapsable
        collapsed={showSearch.val}
        onCollapse={showSearch.toggle}
        heading={searchResults ? `Search Results (${searchResults.length})` : 'Search Results'}
      >
        <List query={addQuery} items={searchResults || []} />
      </Panel>
    </>
  )
}

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
