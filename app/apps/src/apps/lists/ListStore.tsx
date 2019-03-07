import { loadMany } from '@o/bridge'
import { AppProps, useStoresSimple } from '@o/kit'
import { SearchResultModel } from '@o/models'
import { Button } from '@o/ui'
import { ensure, react, useHook } from '@o/use-store'
import React from 'react'
import { searchGroupsToResults } from '../search-app/searchGroupsToResults'

export class ListStore {
  props: AppProps
  stores = useHook(useStoresSimple)
  query = ''
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

  searchResults = react(
    () => [this.query, this.stores.spaceStore.activeSpace],
    async ([query, space], { sleep }) => {
      ensure('space', !!space)
      if (!query) {
        return null
      }
      // make searchresults lower priority than filtered
      await sleep(130)
      const results = await loadMany(SearchResultModel, {
        args: {
          spaceId: space.id,
          query,
          take: 20,
        },
      })
      await sleep(0)
      return searchGroupsToResults(results).map(item => ({
        ...item,
        after: <Button margin={['auto', 0, 'auto', 10]} icon="add" />,
      }))
    },
  )

  setQuery = val => {
    this.query = val
  }
}
