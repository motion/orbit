import { react, always } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { App, AppModel, ListsApp } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { fuzzyQueryFilter } from '../../helpers'
import { Icon } from '../../views/Icon'
import { VirtualList } from '../../views/VirtualList/VirtualList'
import { AppProps } from '../AppProps'
import { ListEdit } from './ListEdit'
import { View, Button } from '@mcro/ui'
import { memo } from '../../helpers/memo'

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
              <Icon name="pin" size={12} />
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

export const ListsAppIndex = memo((props: AppProps) => {
  const { results } = useStore(ListsIndexStore, props)
  const isSmall = props.itemProps && props.itemProps.hide && props.itemProps.hide.subtitle
  return (
    <>
      <VirtualList
        maxHeight={400}
        items={results}
        itemProps={{
          direct: true,
          appType: 'lists',
          titleProps: { fontSize: isSmall ? 18 : 20, fontWeight: 300 },
          ...props.itemProps,
        }}
        getItemProps={index => ({ appConfig: results[index] })}
      />
      <ListEdit />
    </>
  )
})
