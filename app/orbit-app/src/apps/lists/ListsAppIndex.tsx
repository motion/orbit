import { react, always } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { App, AppModel, ListsApp, AppType } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { fuzzyQueryFilter } from '../../helpers'
import { Icon } from '../../views/Icon'
import { VirtualList } from '../../views/VirtualList/VirtualList'
import { AppProps } from '../AppProps'
import { ListEdit } from './ListEdit'
import { View, Button } from '@mcro/ui'
import { observer } from 'mobx-react-lite'

class ListsIndexStore {
  props: AppProps<AppType.lists>
  state = Math.random()

  // todo: this probably should be in some AppStore but there are multiple AppStores already
  apps: App[] = []

  get listsApp() {
    return this.apps.find(app => app.type === AppType.lists) as ListsApp
  }

  willUnmount() {
    this.apps$.unsubscribe()
  }

  private apps$ = observeMany(AppModel, { args: {} }).subscribe(apps => {
    this.apps = apps
  })

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

export const ListsAppIndex = observer((props: AppProps<AppType.lists>) => {
  const { results } = useStore(ListsIndexStore, props)
  const isSmall = props.itemProps && props.itemProps.hide && props.itemProps.hide.subtitle
  return (
    <>
      <VirtualList
        maxHeight={400}
        items={results}
        itemProps={{
          direct: true,
          titleProps: { fontSize: isSmall ? 18 : 20, fontWeight: 300 },
          ...props.itemProps,
        }}
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
      <ListEdit />
    </>
  )
})
