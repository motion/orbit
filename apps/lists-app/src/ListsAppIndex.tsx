import {
  ensure,
  getTargetValue,
  List,
  searchBits,
  TreeList,
  useReaction,
  useTreeList,
} from '@o/kit'
import { Button, Pane, preventDefault, SearchableTopBar, useToggle, View } from '@o/ui'
import { flow } from 'lodash'
import React, { useState } from 'react'

export function ListsAppIndex() {
  const treeList = useTreeList('list')
  const [addQuery, setAddQuery] = useState('')
  const hideSearch = useToggle(true)

  const searchResults = useReaction(
    async (_, { sleep }) => {
      ensure('query', !!addQuery)
      await sleep(100)
      const results = await searchBits({ query: addQuery, take: 20 })
      return results.map(item => ({
        ...item,
        // after: <Button margin={['auto', 0, 'auto', 10]} icon="chevron-right" />,
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
              active={hideSearch.val}
              tooltip="Search to add"
              icon="plus"
              onClick={hideSearch.toggle}
            />
            <Button
              tooltip="Create folder"
              icon="folder-new"
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

      <Pane
        elevation={1}
        collapsable
        collapsed={hideSearch.val}
        onCollapse={hideSearch.toggle}
        title={searchResults ? `Search Results (${searchResults.length})` : 'Search Results'}
        maxHeight={600}
        // background
      >
        <List search={addQuery} items={searchResults || []} />
      </Pane>
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
