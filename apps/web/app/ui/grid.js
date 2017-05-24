import React from 'react'
import { view, observable } from '~/helpers'
import { range, result } from 'lodash'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'

const Layout: HTMLElement = WidthProvider(ReactGridLayout)

@view.attach('layoutStore')
@view.ui
export default class Grid {
  props: {
    onLayoutChange?: Function,
  }

  static defaultProps = {
    rowHeight: 40,
    layout: [],
    onLayoutChange: _ => _,
  }

  @observable.ref layout = null
  gridLayout = null

  componentDidMount() {
    if (this.props.layout) {
      this.setTimeout(() => {
        this.layout = this.props.layout
      }, 150)
    }
  }

  onDragStart = (layout, oldItem, newItem, placeholder, e, element) => {
    this.props.layoutStore.ref('isDragging').set(true)

    if (this.props.onDragStart) {
      this.props.onDragStart()
    }
  }

  onDragStop = () => {
    this.props.layoutStore.ref('isDragging').set(false)
  }

  render({ items, isDraggable, isResizable, onLayoutChange, ...props }) {
    return (
      <Layout
        if={this.layout}
        {...props}
        ref={ref => (this.gridLayout = ref)}
        layout={this.layout}
        onDragStart={this.onDragStart}
        onDragStop={this.onDragStop}
        isDraggable={isDraggable}
        isResizable={isResizable}
        onLayoutChange={onLayoutChange}
      >
        {items.map((item, i) => (
          <gridItem key={item._id || item.key}>
            {item}
          </gridItem>
        ))}
      </Layout>
    )
  }

  static style = {
    gridItem: {
      position: 'relative',
    },
  }
}
