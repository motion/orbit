// @flow
import * as React from 'react'
import { view } from '@mcro/black'

@view
export default class Fade extends React.Component {
  state = {
    isEntering: this.props.isActive,
    isActive: false,
    hasExited: false,
  }

  componentDidMount() {
    if (!this.state.isEntering) {
      this.setState({ isActive: true })
    }
  }

  render({ width, style, children, index, currentIndex, previousIndex }) {
    const movingBack = previousIndex > currentIndex
    return <fade style={{ width, ...style }}>{children}</fade>
  }

  static style = {
    fade: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  }

  static theme = ({ width, index, currentIndex, previousIndex }) => {
    const isActive = currentIndex === index
    return {
      fade: {
        width,
        opacity: isActive ? 1 : 0.5,
        pointerEvents: isActive ? 'auto' : 'none',
        transform: {
          x: (index - currentIndex) * width / 10,
        },
        transition: ['opacity ease-in 250ms', 'transform ease-in 250ms'],
      },
    }
  }
}
