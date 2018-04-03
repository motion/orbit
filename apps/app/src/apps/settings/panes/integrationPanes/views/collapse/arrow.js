import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class CollapseArrow {
  render({ color, open, height, width, size }) {
    return (
      <container css={{ width, height }}>
        <UI.Icon
          color={color || '#fff'}
          name="arrows-1_small-triangle-right"
          size={size || 24}
          $arrow
          $flip={open}
        />
      </container>
    )
  }

  static style = {
    container: {
      // need enough room for the rotation
      // height: 26,
    },
    arrow: {
      transition: 'transform ease-in 100ms',
      marginRight: 3,
    },
    flip: {
      transform: { rotate: '90deg' },
    },
  }
}
