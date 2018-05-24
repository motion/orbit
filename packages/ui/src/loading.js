import React from 'react'
import { view } from '@mcro/black'

@view
export class Loading extends React.Component {
  render() {
    return <loading>loading...</loading>
  }

  static style = {
    loading: {
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 24,
      opacity: 0.8,
    },
  }

  static theme = {}
}
