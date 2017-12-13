// @flow
import * as React from 'react'
import { view } from '@mcro/black'

@view
export default class Fade {
  render({ width, style, children, index, currentIndex, previousIndex }) {
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
    const movingBackwards = previousIndex > currentIndex
    return {
      fade: {
        width,
        opacity: currentIndex === index ? 1 : 0,
        pointerEvents: currentIndex === index ? 'auto' : 'none',
        transform: {
          x: (index - currentIndex) * width / 10,
        },
        transition: ['opacity ease-in 100ms', 'transform ease-in 100ms'],
      },
    }
  }
}
