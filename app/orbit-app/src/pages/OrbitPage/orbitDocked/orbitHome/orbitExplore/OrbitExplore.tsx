import * as React from 'react'
import { view, react, ensure } from '@mcro/black'
import { PaneManagerStore } from '../../../PaneManagerStore'
import { SelectionStore, SelectionGroup } from '../../SelectionStore'
import { AppsStore } from '../../../../../stores/AppsStore'
import { OrbitCarouselSection } from '../OrbitCarouselSection'
import { observeMany } from '@mcro/model-bridge'
import { List } from 'react-virtualized'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import { ORBIT_WIDTH } from '@mcro/constants'
import { pullAll, difference } from 'lodash'
import { IntegrationType } from '@mcro/models'

type Props = {
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  appsStore?: AppsStore
  store?: OrbitExploreStore
}

const TITLE_HEIGHT = 30
const cardHeight = (group: SelectionGroup) => (group.name === 'People' ? 60 : 80)
const rowHeight = (group: SelectionGroup) => cardHeight(group) + TITLE_HEIGHT

const SortableItem = SortableElement(({ value }: { value: SelectionGroup }) => {
  const { name, items, startIndex } = value
  const width = 180
  return (
    <div style={{ height: rowHeight(value) }}>
      <OrbitCarouselSection
        offset={startIndex}
        items={items}
        categoryName={name}
        cardSpace={6}
        horizontalPadding={12}
        cardHeight={cardHeight(value)}
        cardWidth={width}
      />
    </div>
  )
})

class VirtualList extends React.Component<{ items: SelectionGroup[] }> {
  List: any
  render() {
    const { items } = this.props
    return (
      <List
        ref={instance => (this.List = instance)}
        rowHeight={({ index }) => rowHeight(items[index])}
        rowRenderer={({ index, key }) => {
          console.log('key', key)
          const group = items[index]
          return (
            <SortableItem
              key={group.items.map(x => `${x.id}`).join(' ')}
              index={index}
              value={group}
            />
          )
        }}
        rowCount={items.length}
        width={ORBIT_WIDTH}
        height={items.reduce((a, b) => a + rowHeight(b), 0)}
      />
    )
  }
}

const SortableList = SortableContainer(VirtualList, { withRef: true })

class OrbitExploreStore {
  props: Props
  streams: { [a: string]: { values: any[]; name: string } } = {}
  sortOrder = []

  get isActive() {
    return this.props.paneManagerStore.activePane === 'home'
  }

  setSelectionHandler = react(
    () => [this.isActive, this.results],
    async ([isActive], { sleep }) => {
      ensure('is active', !!isActive)
      // avoid doing it to much during rapid initial updates...
      await sleep(150)
      this.props.selectionStore.setResults(this.results)
    },
  )

  results = react(
    () => [this.streams, this.sortOrder],
    ([streams]) => {
      let results: SelectionGroup[] = []
      let offset = 0
      for (const id of this.sortOrder) {
        if (!streams[id] || streams[id].values.length === 0) {
          continue
        }
        const { values, name } = streams[id]
        results.push({
          name,
          type: 'row',
          items: values,
          startIndex: offset,
          id,
        })
        offset += values.length
      }
      return results
    },
    {
      defaultValue: [],
    },
  )

  state = react(
    () => this.props.appsStore.activeApps,
    apps => {
      // dispose on re-run
      if (this.state) {
        this.state.dispose()
      }
      const disposers = []
      // setup stream subscriptions
      for (const stringId in apps) {
        const id = stringId as IntegrationType
        const { name, model, defaultQuery } = apps[id]
        const subscription = observeMany(model, {
          args: defaultQuery as any,
        }).subscribe(values => {
          if (values.length) {
            // add this id of not in sort order
            if (this.sortOrder.indexOf(+id) === -1) {
              this.sortOrder.push(+id)
            }
          }
          this.streams = {
            ...this.streams,
            [id]: { values, name },
          }
        })
        disposers.push(() => subscription.unsubscribe())
      }
      // remove old sorts if removed
      const removed = difference(Object.keys(apps), this.sortOrder)
      if (removed.length) {
        console.log('to remove', removed)
        this.sortOrder = pullAll(this.sortOrder, removed)
        console.log('removed deleted', this.sortOrder)
      }
      return {
        dispose: () => disposers.map(x => x()),
      }
    },
  )

  SortableList: any

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      console.log('old sort', this.sortOrder)
      this.sortOrder = arrayMove(this.sortOrder, oldIndex, newIndex)
      console.log('new sort', this.sortOrder)
      // We need to inform React Virtualized that the items have changed heights
      const instance = this.SortableList.getWrappedInstance()
      instance.List.recomputeRowHeights()
      instance.forceUpdate()
    }
  }
}

@view.attach('paneManagerStore', 'selectionStore', 'appsStore')
@view.attach({
  store: OrbitExploreStore,
})
@view
export class OrbitExplore extends React.Component<Props> {
  render() {
    const { store } = this.props
    const { results } = store
    return (
      <SortableList
        ref={instance => (store.SortableList = instance)}
        items={results}
        onSortEnd={store.onSortEnd}
        distance={16}
      />
    )
  }
}
