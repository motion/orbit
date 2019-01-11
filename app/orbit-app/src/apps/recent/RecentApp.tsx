import * as React from 'react'
import { view, react, ensure, attach } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { List } from 'react-virtualized'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import { ORBIT_WIDTH } from '@mcro/constants'
import { pullAll, difference } from 'lodash'
import { PersonBitModel, BitModel, SourceModel, Bit, PersonBit, AppType } from '@mcro/models'
import { allIntegrations } from '../../sources'
import { OrbitCarouselSection } from '../../components/OrbitCarouselSection'
import { AppProps } from '../AppProps'
import { SelectionGroup } from '../SelectionResults'

const models = {
  'person-bit': PersonBitModel,
  bit: BitModel,
  app: SourceModel,
}

type Props = AppProps<AppType.home> & {
  store?: RecentAppStore
}

const lipSize = 20
const TITLE_HEIGHT = 30
const cardHeight = (group: SelectionGroup) => (group.name === 'Directory' ? 60 : 80)
const rowHeight = (group: SelectionGroup, isLast?) =>
  cardHeight(group) + TITLE_HEIGHT + (isLast ? lipSize : 0)

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

class VirtualCarouselRow extends React.Component<{ items: SelectionGroup[] }> {
  List: any
  render() {
    const { items } = this.props
    return (
      <List
        ref={instance => (this.List = instance)}
        rowHeight={({ index }) => rowHeight(items[index], index === items.length - 1)}
        rowRenderer={({ index, key }) => {
          const group = items[index]
          return <SortableItem key={`${key}${group.ids.join(' ')}`} index={index} value={group} />
        }}
        rowCount={items.length}
        width={ORBIT_WIDTH}
        height={items.reduce((a, b) => a + rowHeight(b), lipSize)}
      />
    )
  }
}

const SortableCarouselRow = SortableContainer(VirtualCarouselRow, { withRef: true })

class RecentAppStore {
  props: Props
  streams: { [a: string]: { values: (Bit | PersonBit)[]; name: string } } = {}

  // sort order with date
  private sortedAt = 0
  private _sortOrder = []
  get sortOrder() {
    return this._sortOrder
  }
  set sortOrder(val) {
    this.sortedAt = Date.now()
    this._sortOrder = val
  }

  setSelectionHandler = react(
    () => [this.props.appStore.isActive, this.results],
    async ([isActive], { sleep }) => {
      ensure('is active', !!isActive)
      // avoid doing it to much during rapid initial updates...
      await sleep(150)
      this.props.appStore.setResults(this.results)
    },
  )

  results = react(
    () => [this.streams, this.sortOrder],
    async ([streams], { sleep }) => {
      if (Date.now() - this.sortedAt > 16) {
        await sleep(200)
      }
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
          ids: values.map(item => item.id),
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
    () => [allIntegrations.person, ...this.props.sourcesStore.activeSources],
    apps => {
      // dispose on re-run
      if (this.state) {
        this.state.dispose()
      }
      const disposers = []
      // setup stream subscriptions
      for (const app of apps) {
        const model = models[app.modelType]
        const { display, defaultQuery } = app
        const subscription = observeMany(model, {
          args: defaultQuery as any,
        }).subscribe(this.updateStreams(display.name))
        disposers.push(() => subscription.unsubscribe())
      }
      // remove old sorts if removed
      const removed = difference(this.sortOrder, Object.keys(apps))
      if (removed.length) {
        this.sortOrder = pullAll(this.sortOrder, removed)
        console.log('removed streams', Object.keys(apps), removed, this.sortOrder)
      }
      return {
        dispose: () => disposers.map(x => x()),
      }
    },
  )

  updateStreams = name => (values: any[]) => {
    if (values.length) {
      // add this id of not in sort order
      if (this.sortOrder.indexOf(name) === -1) {
        this.sortOrder.push(name)
      }
    }
    this.streams = {
      ...this.streams,
      [name]: { values, name },
    }
  }

  SortableCarouselRow: any

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      console.log('old sort', this.sortOrder)
      this.sortOrder = arrayMove(this.sortOrder, oldIndex, newIndex)
      console.log('new sort', this.sortOrder)
      // We need to inform React Virtualized that the items have changed heights
      const instance = this.SortableCarouselRow.getWrappedInstance()
      instance.List.recomputeRowHeights()
      instance.forceUpdate()
    }
  }
}

@attach({
  store: RecentAppStore,
})
@view
export class RecentApp extends React.Component<Props> {
  render() {
    const { store } = this.props
    const { results } = store
    return (
      <SortableCarouselRow
        ref={instance => (store.SortableCarouselRow = instance)}
        items={results}
        onSortEnd={store.onSortEnd}
        distance={16}
      />
    )
  }
}
