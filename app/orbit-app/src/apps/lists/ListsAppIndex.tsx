import { always, react } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { AppType, ListsApp, SearchResultModel } from '@mcro/models'
import { Button } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import OrbitFloatingBar from '../../components/OrbitFloatingBar'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { fuzzyQueryFilter } from '../../helpers'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Breadcrumb, Breadcrumbs } from '../../views/Breadcrumbs'
import SelectableList from '../../views/Lists/SelectableList'
import { AppProps } from '../AppProps'
import ListEdit from './ListEdit'

class ListsIndexStore {
  props: AppProps<AppType.lists>
  stores = useHook(useStoresSafe)

  get apps() {
    return this.stores.spaceStore.apps
  }

  get listsApp() {
    return this.apps.find(app => app.type === AppType.lists) as ListsApp
  }

  get allLists() {
    if (!this.listsApp || !this.listsApp.data || !this.listsApp.data.lists) {
      return []
    }
    return this.listsApp.data.lists.map((listItem, index) => {
      return {
        id: index,
        index,
        type: 'list',
        title: listItem.name,
        after: <Button circular chromeless size={0.9} icon="arrowright" />,
        subtitle: (listItem.bits || []).length + ' items',
      }
    })
  }

  get activeQuery() {
    return this.props.appStore.activeQuery
  }

  get results() {
    return [...this.currentFolderResults, ...this.otherFolderResults, ...this.searchResults]
  }

  currentFolderResults = react(
    () => [this.activeQuery, always(this.allLists)],
    ([query]) => {
      return fuzzyQueryFilter(query, this.allLists, {
        key: 'title',
      })
    },
    { defaultValue: this.allLists },
  )

  // TODO make this work
  otherFolderResults = react(
    () => [this.activeQuery, always(this.allLists)],
    ([query]) => {
      return fuzzyQueryFilter(query, this.allLists, {
        key: 'title',
      })
    },
    {
      defaultValue: [],
    },
  )

  searchResults = react(
    () => [this.activeQuery, this.stores.spaceStore.activeSpace.id, always(this.allLists)],
    async ([query, spaceId], { sleep }) => {
      if (query.length < 2 || this.results.length > 10) {
        return []
      }
      // make searchresults lower priority than filtered
      await sleep(40)
      const results = await loadMany(SearchResultModel, {
        args: {
          spaceId,
          query,
          take: 20,
        },
      })
      return results.map(r => ({
        ...r,
        group: 'Search Results',
      }))
    },
    {
      defaultValue: [],
    },
  )
}

export const ListsAppIndex = observer(function ListsAppIndex(props: AppProps<AppType.lists>) {
  const { results } = useStore(ListsIndexStore, props)
  return (
    <>
      <OrbitToolbar />
      {/* <OrbitToolbar>
        <ListAppBreadcrumbs />
      </OrbitToolbar>
      <ListAppBreadcrumbs /> */}
      <SelectableList minSelected={0} items={results} sortable />

      <OrbitFloatingBar showSearch>
        <ListEdit />
      </OrbitFloatingBar>
    </>
  )
})

function ListAppBreadcrumbs() {
  return (
    <Breadcrumbs>
      <Breadcrumb>Memory</Breadcrumb>
      <Breadcrumb>Memory</Breadcrumb>
      <Breadcrumb>Memory</Breadcrumb>
    </Breadcrumbs>
  )
}
