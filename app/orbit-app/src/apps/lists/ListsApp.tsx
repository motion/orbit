import * as React from 'react'
import { SortableList } from '../../views/SortableList/SortableList'
import { react } from '@mcro/black'
import { AppProps } from '../AppProps'
import { fuzzyQueryFilter } from '../../helpers'
import { useStore } from '@mcro/use-store'

class ListsStore {
  props: AppProps
  state = Math.random()
  allLists = [
    {
      id: 0,
      index: 0,
      type: 'list',
      title: 'First List',
      subtitle: '10 items',
    },
    {
      id: 1,
      index: 1,
      type: 'list',
      title: 'Next list',
      subtitle: '3 items',
    },
    {
      id: 2,
      index: 2,
      type: 'list',
      title: 'Third list',
      subtitle: '34 items',
    },
    {
      id: 3,
      index: 3,
      type: 'list',
      title: 'Items I Really Like',
      subtitle: '100 items',
    },
    {
      id: 4,
      index: 4,
      type: 'list',
      title: 'Another Another List',
      subtitle: '1 items',
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
    { defaultValue: [] },
  )
}

export function ListsApp(props: AppProps & { width: number }) {
  const store = useStore(ListsStore, props)
  return (
    <>
      <SortableList items={store.results} width={props.width} itemProps={{ direct: true }} />
    </>
  )
}
