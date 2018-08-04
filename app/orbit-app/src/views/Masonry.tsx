import * as React from 'react'
import { view, on } from '@mcro/black'

const rowHeight = 1
const gridGap = 7
const gridColumnGap = 10

const MasonryGrid = view({
  display: 'grid',
  margin: [0, -5],
})

export type MasonryProps = {
  minWidth?: number
  measureKey?: number
}

@view.ui
export class Masonry extends React.Component<MasonryProps> {
  static defaultProps = {
    measureKey: 0,
    minWidth: 200,
  }

  state = {
    measured: false,
    measureKey: null,
    gridChildren: null,
  }

  static getDerivedStateFromProps(props, state) {
    if (state.measureKey !== props.measureKey) {
      return { measured: false, measureKey: props.measureKey }
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
      const content = item.firstChild as HTMLDivElement
      const contentHeight = content.clientHeight
      const rowSpan = Math.ceil(
        (contentHeight + gridGap) / (rowHeight + gridGap),
      )
      styles.push({ gridRowEnd: `span ${rowSpan}` })
    }
    const gridChildren = React.Children.map(
      this.props.children,
      (child, index) => {
        if (typeof child === 'string' || typeof child === 'number') {
          return child
        }
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
    console.log('123', children, this.state.gridChildren)
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
