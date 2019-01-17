import { always, react } from '@mcro/black'
import { AppType, ListsApp } from '@mcro/models'
import { Button, View } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { fuzzyQueryFilter } from '../../helpers'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Icon } from '../../views/Icon'
import { OrbitList } from '../../views/Lists/OrbitList'
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
        after: (
          <View margin="auto" padding={[0, 6]}>
            <Button circular size={0.9}>
              <Icon name="pin" size={12} color="#fff" />
            </Button>
          </View>
        ),
        subtitle: (listItem.bits || []).length + ' items',
      }
    })
  }

  get activeQuery() {
    return this.props.appStore.activeQuery
  }

  setSelectionResults = react(
    () => always(this.results),
    () => {
      this.props.appStore.setResults([
        { type: 'column', indices: this.results.map((_, index) => index) },
      ])
    },
  )

  results = react(
    () => always(this.activeQuery, this.allLists),
    () => {
      return fuzzyQueryFilter(this.activeQuery, this.allLists, {
        key: 'title',
      })
    },
    { defaultValue: this.allLists },
  )
}

export const ListsAppIndex = observer(function ListsAppIndex(props: AppProps<AppType.lists>) {
  const { results } = useStore(ListsIndexStore, props)
  return (
    <>
      <OrbitList
        items={results}
        itemProps={props.itemProps}
        getItemProps={index => {
          const result = results[index]
          return {
            appConfig: {
              id: `${result.id}`,
              title: result.title,
              type: AppType.lists,
              index: result.index,
            },
          }
        }}
      />
      <View flex={1} />
      <ListEdit />
    </>
  )
})
