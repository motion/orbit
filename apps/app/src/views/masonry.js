import * as React from 'react'
import { view, on } from '@mcro/black'
import isEqual from 'react-fast-compare'

const rowHeight = 2
const gridGap = 10
const gridColumnGap = 10

@view.ui
export class Masonry extends React.Component {
  state = {
    measured: false,
    children: null,
    gridChildren: null,
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(state.children, props.children)) {
      return { measured: false, children: props.children }
    }
    return null
  }

  gridNode = null

  async setGrid(gridRef) {
    if (!gridRef) return
    if (this.state.measured) return
    this.gridNode = gridRef
    // small delay fixes bug that happens sometimes, low confidence
    on(this, setTimeout(this.measureGrid, 30))
  }

  measureGrid = () => {
    if (!this.gridNode) {
      return
    }
    const styles = []
    for (const item of Array.from(this.gridNode.children)) {
      const content = item.firstChild
      const contentHeight = content.clientHeight
      const rowSpan = Math.ceil(
        (contentHeight + gridGap) / (rowHeight + gridGap),
      )
      styles.push({ gridRowEnd: `span ${rowSpan}` })
    }
    const gridChildren = React.Children.map(
      this.props.children,
      (child, index) => {
        return React.cloneElement(child, {
          inGrid: true,
          style: {
            ...styles[index],
            ...child.props.style,
          },
        })
      },
    )
    this.setState({
      gridChildren,
      measured: true,
    })
  }

  handleGridRef = ref => this.setGrid(ref)

  gridStyle = { gridAutoRows: rowHeight, gridGap, gridColumnGap }

  render() {
    const { measured } = this.state
    const { children, ...props } = this.props
    if (!measured) {
      return (
        <grid
          ref={this.handleGridRef}
          {...props}
          css={{ opacity: 0, gridColumnGap }}
        >
          {children}
        </grid>
      )
    }
    return (
      <grid style={this.gridStyle} {...props}>
        {this.state.gridChildren}
      </grid>
    )
  }

  static style = {
    grid: {
      margin: [0, -4],
      // maxHeight: '100%',
      // overflowY: 'scroll',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
      // gridAutoRows: 40,
    },
  }
}
