// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class Root extends React.Component {
  render() {
    return <crawler>hi, im a crawler</crawler>
  }

  static style = {
    crawler: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 100,
      background: 'red',
      zIndex: Number.MAX_SAFE_INTEGER,
      transform: {
        z: Number.MAX_SAFE_INTEGER,
      },
    },
  }
}
