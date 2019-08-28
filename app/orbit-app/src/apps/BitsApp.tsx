import { createApp, useBitSearch } from '@o/kit'
import { Table, useActiveSearchQuery } from '@o/ui'
import React from 'react'

/**
 * TODO we need a decent manager for bits in one location
 * This can be it, we need to figure out how the dock preview would lok
 */

export default createApp({
  id: 'bits',
  name: 'Manage Bits',
  icon: 'item',
  app: BitsApp,
})

function BitsApp() {
  const bits = useBitSearch()

  // const searchState = useSearchState()
  // const searchString = useDebounceValue(searchState.query, 200)
  // const [bits] = useBits({
  //   order: {
  //     bitCreatedAt: 'desc',
  //   },
  // })

  return (
    <Table
      searchable
      query={useActiveSearchQuery()}
      selectable="multi"
      shareable
      items={bits.slice(0, 5000)}
      columns={{
        id: {
          value: 'ID',
        },
        title: {
          value: 'title',
          flex: 2,
        },
        body: {
          value: 'Body',
          flex: 2,
        },
        appId: {
          value: 'appId',
        },
        authorId: {
          value: 'authorId',
        },
        photo: {
          value: 'Photo',
        },
        email: {
          value: 'Email',
        },
        data: {
          value: 'Data',
        },
        createdAt: {
          value: 'Created',
        },
        updatedAt: {
          value: 'Updated',
        },
      }}
    />
  )
}
