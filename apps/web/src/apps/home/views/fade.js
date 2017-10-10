// @flow
import * as React from 'react'
import { view } from '@mcro/black'

@view
export default class Fade {
  render({ children }) {
    return <fadeCol>{children}</fadeCol>
  }

  static style = {
    fadeCol: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transition: 'all ease-in 100ms',
    },
  }

  static theme = ({ width, index, currentIndex }) => ({
    fadeCol: {
      width,
      opacity: currentIndex === index ? 1 : 0,
      pointerEvents: currentIndex === index ? 'auto' : 'none',
      transform: {
        x: (currentIndex - index) * width / 10,
      },
    },
  })
}
