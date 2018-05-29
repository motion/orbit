import * as React from 'react'
import { view } from '@mcro/black'
import isEqual from 'react-fast-compare'

const rowHeight = 4
const gridGap = 6
const gridColumnGap = 8

@view.ui
export class Masonry extends React.Component {
  state = {
    measured: false,
    children: null,
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(state.children, props.children)) {
      return { measured: false, children: props.children }
    }
    return {
      children: props.children,
    }
  }

  setGrid(grid) {
    if (!grid) return
    if (this.state.measured) return
    this.styles = []
    for (const item of Array.from(grid.children)) {
      const content = item.querySelector('.card')
      const contentHeight = content.clientHeight
      const rowSpan = Math.ceil(
        (contentHeight + gridGap) / (rowHeight + gridGap),
      )
      this.styles.push({ gridRowEnd: `span ${rowSpan}` })
    }
    this.setState({ measured: true })
  }

  handleGridRef = ref => this.setGrid(ref)

  gridStyle = { gridAutoRows: rowHeight, gridGap, gridColumnGap }

  render() {
    const { measured } = this.state
    const { children, ...props } = this.props
    if (!measured) {
      return (
        <grid ref={this.handleGridRef} {...props}>
          {children}
        </grid>
      )
    }
    return (
      <grid style={this.gridStyle} {...props}>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            style: {
              ...this.styles[index],
              ...child.props.style,
            },
          })
        })}
      </grid>
    )
  }

  static style = {
    grid: {
      minHeight: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
    },
  }
}
