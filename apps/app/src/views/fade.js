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
    const isActive = currentIndex === index
    const movingBack = previousIndex > currentIndex
    const movingForward = previousIndex < currentIndex
    const x = (index - currentIndex) * width / 5

    // console.log(
    //   'Fade:',
    //   index,
    //   x,
    //   movingBack ? 'BACK' : movingForward ? 'FORWARD' : ''
    // )

    return (
      <fade
        css={{
          ...style,
          width,
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? 'auto' : 'none',
          transform: {
            x,
          },
        }}
      >
        {children}
      </fade>
    )
  }

  static style = {
    fade: {
      transition: ['opacity ease-in 250ms', 'transform ease-in 250ms'],
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: {
        x: 0,
      },
    },
  }
}
