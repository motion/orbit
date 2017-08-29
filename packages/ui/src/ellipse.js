import React from 'react'
import { view } from '@mcro/black'

@view.ui
export default class Ellipse extends React.Component {
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
