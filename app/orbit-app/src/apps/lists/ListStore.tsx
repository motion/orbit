import { react } from '@mcro/black'
import { loadMany, observeOne } from '@mcro/model-bridge'
import { AppModel, SearchResultModel } from '@mcro/models'
import { Button } from '@mcro/ui'
import { useHook } from '@mcro/use-store'
import { dropRight, last } from 'lodash'
import React from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { searchGroupsToResults } from '../../stores/SearchStore'
import { ListAppProps } from './ListsApp'
import { ListAppDataItemFolder, ListsAppBit } from './types'

export class ListStore {
  props: ListAppProps

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
    return this.appRaw as ListsAppBit
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
      await sleep(130)
      const results = await loadMany(SearchResultModel, {
        args: {
          spaceId,
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

  back = () => {
    this.depth--
    this.history = dropRight(this.history)
  }
}
