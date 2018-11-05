import * as React from 'react'
import { WindowScroller, List, CellMeasurerCache, CellMeasurer } from 'react-virtualized'
import { ensure, react, StoreContext } from '@mcro/black'
import { View } from '@mcro/ui'
import { SortableContainer } from 'react-sortable-hoc'
import { OrbitItemSingleton } from '../OrbitItemStore'
import { SubPaneStore } from '../../components/SubPaneStore'
import { Banner } from '../Banner'
import { SortableListItem } from './SortableListItem'
import { ItemProps } from '../OrbitItemProps'
import { App } from '@mcro/stores'
import { ORBIT_WIDTH } from '@mcro/constants'
import { AppStore } from '../../apps/AppStore'
import { useStore } from '@mcro/use-store'

type Props = {
  items?: any[]
  itemProps?: ItemProps<any>
  appStore?: AppStore
  subPaneStore?: SubPaneStore
}

class VirtualList extends React.Component<any> {
  render() {
    return <List {...this.props} ref={this.props.forwardRef} />
  }
}
const SortableListContainer = SortableContainer(VirtualList, { withRef: true })

class SortableListStore {
  props: Props
  windowScrollerRef = React.createRef<WindowScroller>()
  listRef = React.createRef<List>()
  rootRef = React.createRef<HTMLDivElement>()
  height = 100
  width = 0
  isSorting = false
  observing = false
  cache = new CellMeasurerCache({
    defaultHeight: 60,
    defaultWidth: ORBIT_WIDTH,
    fixedWidth: true,
  })

  resizeOnChange = react(
    () => this.props.items && Math.random(),
    () => {
      ensure('this.listRef', !!this.listRef.current)
      this.resizeAll()
    },
  )

  scrollToRow = react(
    () => this.props.appStore.activeIndex,
    index => {
      ensure('not clicked', Date.now() - OrbitItemSingleton.lastClick > 50)
      ensure('valid index', index > -1)
      ensure('has list', !!this.listRef.current)
      this.listRef.current.scrollToRow(index)
    },
  )

  measure = () => {
    console.log('measure')
    let height = 0
    for (const [index] of this.props.items.entries()) {
      if (index > 40) break
      height += this.cache.rowHeight(index)
    }
    console.log('setting height', height)
    this.width = this.rootRef.current ? this.rootRef.current.clientWidth : 0
    this.height = height
  }

  private resizeAll = () => {
    this.cache.clearAll()
    if (this.listRef.current) {
      this.listRef.current.recomputeRowHeights()
      this.measure()
    }
  }
}

export function SortableList(props: Props) {
  const context = React.useContext(StoreContext)
  const store = useStore(SortableListStore, { ...props, appStore: context.appStore })

  const rowRenderer = ({ index, parent, style }) => {
    const model = props.items[index]
    return (
      <CellMeasurer
        key={`${model.id}${index}`}
        cache={store.cache}
        columnIndex={0}
        parent={parent}
        rowIndex={index}
      >
        <div style={style}>
          <SortableListItem
            model={model}
            index={index}
            realIndex={index}
            query={App.state.query}
            itemProps={props.itemProps}
          />
        </div>
      </CellMeasurer>
    )
  }

  if (!props.items.length) {
    return (
      <View margin={[10, 0]}>
        <Banner>No results</Banner>
      </View>
    )
  }

  return (
    <div
      ref={store.rootRef}
      style={{
        height: store.height,
      }}
    >
      {store.width && (
        <SortableListContainer
          forwardRef={store.listRef}
          items={props.items}
          deferredMeasurementCache={store.cache}
          height={store.height}
          width={store.width}
          rowHeight={store.cache.rowHeight}
          overscanRowCount={20}
          rowCount={props.items.length}
          estimatedRowSize={100}
          rowRenderer={rowRenderer}
          pressDelay={120}
          pressThreshold={17}
          lockAxis="y"
        />
      )}
    </div>
  )
}
