import React from 'react'
import { view, observable } from '~/helpers'
import { range, result } from 'lodash'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'

const Layout: HTMLElement = WidthProvider(ReactGridLayout)

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
    console.log('ondragstart', e, e && e.clientY)
    App.dragStartedAt = e.clientY

    if (this.props.onDragStart) {
      this.props.onDragStart()
    }
  }

  onDragStop = () => {
    App.dragStartedAt = false
  }

  render({ items, ...props }) {
    return (
      <Layout
        if={this.layout}
        {...props}
        ref={ref => (this.gridLayout = ref)}
        layout={this.layout}
        onDragStart={this.onDragStart}
        onDragStop={this.onDragStop}
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
