import * as React from 'react'
import { view, on } from '@mcro/black'
import isEqual from 'react-fast-compare'
import * as UI from '@mcro/ui'

const rowHeight = 2
const gridGap = 9
const gridColumnGap = 9

const Grid = view(UI.Grid, {
  margin: [0, -5],
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
})

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
        <Grid
          ref={this.handleGridRef}
          {...props}
          opacity={0}
          gridColumnGap={gridColumnGap}
        >
          {children}
        </Grid>
      )
    }
    return (
      <Grid {...this.gridStyle} {...props}>
        {this.state.gridChildren}
      </Grid>
    )
  }
}
