import * as React from 'react'
import { view, on } from '@mcro/black'
import isEqual from 'react-fast-compare'

const rowHeight = 2
const gridGap = 9
const gridColumnGap = 9

const MasonryGrid = view({
  display: 'grid',
  margin: [0, -5],
})

export type MasonryProps = {
  minWidth: number
}

@view.ui
export class Masonry extends React.Component<MasonryProps> {
  static defaultProps = {
    minWidth: 200,
  }

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

  gridNode: HTMLElement = null

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

  render() {
    const { measured } = this.state
    const { children, minWidth, ...props } = this.props
    const style = {
      gridColumnGap,
      gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px,1fr))`,
    }
    if (!measured) {
      return (
        <MasonryGrid
          forwardRef={this.handleGridRef}
          {...props}
          style={{
            opacity: 0,
            ...style,
          }}
        >
          {children}
        </MasonryGrid>
      )
    }
    return (
      <MasonryGrid
        style={{ ...style, gridAutoRows: rowHeight, gridGap, gridColumnGap }}
        {...props}
      >
        {this.state.gridChildren}
      </MasonryGrid>
    )
  }
}
