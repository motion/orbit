import React from 'react'
import { view } from '@jot/black'

@view.ui
export default class Ellipse {
  render() {
    return <ellipse {...this.props} />
  }

  static style = {
    ellipse: {
      display: 'block',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  }
}
