import * as React from 'react'
import { react } from '@mcro/black'
import { AppProps } from '../AppProps'
import { fuzzyQueryFilter } from '../../helpers'
import { useStore } from '@mcro/use-store'
import { Icon } from '../../views/Icon'
import { VirtualList } from '../../views/VirtualList/VirtualList'

class ListsIndexStore {
  props: AppProps
  state = Math.random()
  allLists = [
    {
      id: 0,
      index: 0,
      type: 'lists',
      title: 'First List',
      afterTitle: <Icon name="pin" size={16} />,
      // subtitle: '10 items',
    },
    {
      id: 1,
      index: 1,
      type: 'lists',
      title: 'Next list',
      // subtitle: '3 items',
    },
    {
      id: 2,
      index: 2,
      type: 'lists',
      title: 'Third list',
      // subtitle: '34 items',
    },
    {
      id: 3,
      index: 3,
      type: 'lists',
      title: 'Items I Really Like',
      // subtitle: '100 items',
    },
    {
      id: 4,
      index: 4,
      type: 'lists',
      title: 'Another Another List',
      // subtitle: '1 items',
    },
  ]

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
  return (
    <>
      <VirtualList maxHeight={400} items={store.results} itemProps={{ direct: true }} />
    </>
  )
}
