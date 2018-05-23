import * as React from 'react'
import { view } from '@mcro/black'
import isEqual from 'react-fast-compare'

const rowHeight = 2
const gridGap = 6
const gridColumnGap = 8

@view.ui
export default class Masonry extends React.Component {
  state = {
    measured: false,
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props, nextProps)) {
      this.setState({ measured: false })
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

  render() {
    const { measured } = this.state
    const { children, ...props } = this.props
    if (!measured) {
      return (
        <grid ref={ref => this.setGrid(ref)} {...props}>
          {children}
        </grid>
      )
    }
    return (
      <grid
        style={{ gridAutoRows: rowHeight, gridGap, gridColumnGap }}
        {...props}
      >
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
