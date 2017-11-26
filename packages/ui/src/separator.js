import * as React from 'react'
import { view } from '@mcro/black'

@view.ui
export default class Separator {
  render() {
    return <separator {...this.props} />
  }

  static style = {
    separator: {
      fontSize: 14,
      fontWeight: 500,
      padding: [12, 10, 3],
      justifyContent: 'center',
      // background: [0, 0, 0, 0.02],
      borderBottom: [1, [0, 0, 0, 0.2]],
      textAlign: 'left',
      opacity: 0.4,
      pointerEvents: 'none',
      userSelect: 'none',
      position: 'relative',
    },
  }
}
