import { react } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { App, AppModel, ListsApp } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { fuzzyQueryFilter } from '../../helpers'
import { Icon } from '../../views/Icon'
import { VirtualList } from '../../views/VirtualList/VirtualList'
import { AppProps } from '../AppProps'

class ListsIndexStore {
  props: AppProps
  state = Math.random()

  // todo: this probably should be in some AppStore but there are multiple AppStores already
  apps: App[] = []

  get listsApp(): ListsApp {
    return this.apps.find(app => app.type === 'lists')
  }

  willUnmount() {
    this.apps$.unsubscribe()
  }

  private apps$ = observeMany(AppModel, { args: {} }).subscribe(apps => {
    this.apps = apps
  })

  get allLists() {
    if (!this.listsApp || !this.listsApp.values || !this.listsApp.values.lists)
      return []

    return this.listsApp.values.lists.map((listItem, index) => {
      return {
        id: index,
        index,
        type: 'list',
        title: listItem.name,
        afterTitle: <Icon name="pin" size={16} />,
        subtitle: (listItem.bitIds || []).length + ' items',
      }
    })
  }

  get activeQuery() {
    return this.props.appStore.activeQuery
  }

  setSelectionResults = react(
    () => this.results && Math.random(),
    () => {
      this.props.appStore.setResults([{ type: 'column', ids: this.results.map(x => x.id) }])
    },
  )

  results = react(
    () => this.activeQuery && this.allLists && Math.random(),
    () =>
      fuzzyQueryFilter(this.activeQuery, this.allLists, {
        key: 'title',
      }),
    { defaultValue: this.allLists },
  )
}

export function ListsAppIndex(props: AppProps) {
  const store = useStore(ListsIndexStore, props)
  console.log('rendering lists app', store.allLists)
  return (
    <>
      <VirtualList maxHeight={400} items={store.allLists} itemProps={{ direct: true }} />
    </>
  )
}
