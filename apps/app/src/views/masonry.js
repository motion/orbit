import * as React from 'react'
import { view, sleep } from '@mcro/black'
import isEqual from 'react-fast-compare'

const rowHeight = 4
const gridGap = 6
const gridColumnGap = 8

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

  async setGrid(grid) {
    if (!grid) return
    if (this.state.measured) return
    this.styles = []
    await sleep(100)
    for (const item of Array.from(grid.children)) {
      const content = item.querySelector('.card')
      const contentHeight = content.clientHeight
      const rowSpan = Math.ceil(
        (contentHeight + gridGap) / (rowHeight + gridGap),
      )
      this.styles.push({ gridRowEnd: `span ${rowSpan}` })
    }
    const gridChildren = React.Children.map(
      this.props.children,
      (child, index) => {
        return React.cloneElement(child, {
          style: {
            ...this.styles[index],
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
        <grid ref={this.handleGridRef} {...props} css={{ opacity: 0 }}>
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
      height: '100%',
      // overflowY: 'scroll',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
    },
  }
}
